import { dbAll, dbGet, dbRun } from './db.service';
import { Action, CreateActionInput } from '../models/actions.model';
import { streakService } from './streak.service';
import { checkAndAwardBadges } from './badge.service';

class ActionsService {
    public async create(userId: number, data: CreateActionInput): Promise<Action> {
        // Insert the action and return inserted row
        const result = await dbRun(
            `INSERT INTO activities 
            (activity_type, activity_title, activity_description, activity_date, user_id, imagem_path) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [data.activity_type, data.activity_title, data.activity_description, data.activity_date, userId, data.imagem_path]
        );

        const id = result.lastID;
        if (!id) throw new Error('Failed to create action');

        const created = await dbGet<Action>('SELECT * FROM activities WHERE id = ?', [id]);
        if (!created) throw new Error('Action not found after insert');

        // 🔥 Update user streak automatically
        try {
            await streakService.updateStreakOnActivity(userId);
        } catch (error) {
            console.error('Error updating streak:', error);
            // Don't fail the action creation if streak update fails
        }

        // 🎯 Check and award badges automatically
        try {
            await checkAndAwardBadges(userId);
        } catch (error) {
            console.error('Error checking badges:', error);
            // Don't fail the action creation if badge check fails
        }

        return created;
    }

    public async listByUser(userId: number): Promise<Action[]> {
        return dbAll<Action>('SELECT * FROM activities WHERE user_id = ? ORDER BY id DESC', [userId]);
    }

    /**
     * Gets activity statistics for a user
     * Useful for dashboard and profile display
     */
    public async getUserStats(userId: number): Promise<{
        totalActions: number;
        actionsByCategory: Record<string, number>;
        recentActions: Action[];
    }> {
        // Get total actions count
        const totalResult = await dbGet<{ count: number }>(
            'SELECT COUNT(*) as count FROM activities WHERE user_id = ?',
            [userId]
        );

        // Get actions by category
        const categoryResults = await dbAll<{ activity_type: string; count: number }>(
            'SELECT activity_type, COUNT(*) as count FROM activities WHERE user_id = ? GROUP BY activity_type',
            [userId]
        );

        // Get recent actions (last 5)
        const recentActions = await dbAll<Action>(
            'SELECT * FROM activities WHERE user_id = ? ORDER BY activity_date DESC LIMIT 5',
            [userId]
        );

        // Build category map
        const actionsByCategory: Record<string, number> = {};
        categoryResults.forEach(row => {
            actionsByCategory[row.activity_type] = row.count;
        });

        return {
            totalActions: totalResult?.count || 0,
            actionsByCategory,
            recentActions
        };
    }
}

export const actionsService = new ActionsService();

