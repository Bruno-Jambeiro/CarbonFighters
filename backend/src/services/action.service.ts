import { SustainableAction, ActionStats } from '../models/action.model';
import { dbAll, dbGet, dbRun } from './db.service';
import * as badgeService from './badge.service';

/**
 * Creates a new sustainable action and updates the user's streak
 * 4.1 AC3: The streak count must increment by one when the user logs their first action of a new calendar day.
 */
export async function createAction(
    userId: number,
    actionType: string,
    description: string,
    carbonSaved: number = 0,
    points: number = 10,
    actionDate?: string
): Promise<SustainableAction | null> {
    // If no date is provided, use the current date
    const date = actionDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Insert the action
    const result = await dbRun(
        `INSERT INTO sustainable_actions (user_id, action_type, description, carbon_saved, points, action_date)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, actionType, description, carbonSaved, points, date]
    );

    if (!result.lastID) return null;

    // Update the user's streak
    await updateUserStreak(userId, date);

    // Check and award badges automatically
    await badgeService.checkAndAwardBadges(userId);

    // Get the created action
    const action = await dbGet<SustainableAction>(
        'SELECT * FROM sustainable_actions WHERE id = ?',
        [result.lastID]
    );

    return action || null;
}

/**
 * Actually updates the user's streak based on the action date.
 * 4.1 AC1: The system must track the number of consecutive days that a user logs at least one sustainable action.
 * 4.1 AC3: The streak count must increment by one when the user logs their first action of a new calendar day.
 * 4.1 AC4: If a user does not log any action for an entire calendar day, the streak must reset to zero.
 */
async function updateUserStreak(userId: number, actionDate: string): Promise<void> {
    // Get the user's last action date and current streak
    const user = await dbGet<{ last_action_date?: string; current_streak: number }>(
        'SELECT last_action_date, current_streak FROM users WHERE id = ?',
        [userId]
    );

    if (!user) return;

    const lastActionDate = user.last_action_date;
    const currentStreak = user.current_streak || 0;

    // If there is no last action date, this is the first action
    if (!lastActionDate) {
        await dbRun(
            'UPDATE users SET current_streak = 1, last_action_date = ? WHERE id = ?',
            [actionDate, userId]
        );
        return;
    }

    // Calculate the difference in days
    const lastDate = new Date(lastActionDate);
    const newDate = new Date(actionDate);
    const diffTime = newDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Same date, do nothing (already logged action today)
        return;
    } else if (diffDays === 1) {
        // Consecutive day - increment streak (AC3)
        await dbRun(
            'UPDATE users SET current_streak = ?, last_action_date = ? WHERE id = ?',
            [currentStreak + 1, actionDate, userId]
        );
    } else {
        // Skipped days - reset streak (AC4)
        await dbRun(
            'UPDATE users SET current_streak = 1, last_action_date = ? WHERE id = ?',
            [actionDate, userId]
        );
    }
}


// Gets all actions of a user

export async function getUserActions(userId: number): Promise<SustainableAction[]> {
    const actions = await dbAll<SustainableAction>(
        'SELECT * FROM sustainable_actions WHERE user_id = ? ORDER BY action_date DESC, created_at DESC',
        [userId]
    );
    return actions;
}

//Gets the action statistics of a user
export async function getUserActionStats(userId: number): Promise<ActionStats> {
    const stats = await dbGet<{
        total_actions: number;
        total_carbon_saved: number;
        total_points: number;
    }>(
        `SELECT 
            COUNT(*) as total_actions,
            COALESCE(SUM(carbon_saved), 0) as total_carbon_saved,
            COALESCE(SUM(points), 0) as total_points
         FROM sustainable_actions 
         WHERE user_id = ?`,
        [userId]
    );

    const user = await dbGet<{ current_streak: number }>(
        'SELECT current_streak FROM users WHERE id = ?',
        [userId]
    );

    return {
        total_actions: stats?.total_actions || 0,
        total_carbon_saved: stats?.total_carbon_saved || 0,
        total_points: stats?.total_points || 0,
        current_streak: user?.current_streak || 0
    };
}

// Checks and updates the streaks of all users
// (Run daily as a cron job for AC4)
export async function checkAndResetStreaks(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Reset streak for users who did not log an action yesterday
    await dbRun(
        `UPDATE users 
         SET current_streak = 0 
         WHERE last_action_date < ? 
         AND current_streak > 0`,
        [yesterday]
    );
}
