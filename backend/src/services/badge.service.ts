import { Badge, UserBadge, BadgeWithEarnedDate, Notification, RequirementType } from '../models/badge.model';
import { dbAll, dbGet, dbRun } from './db.service';

/**
 * 4.2 CA1: Get all predefined badges in the system
 */
export async function getAllBadges(): Promise<Badge[]> {
    const badges = await dbAll<Badge>('SELECT * FROM badges ORDER BY type, requirement');
    return badges;
}

/**
 * 4.2 CA2 & CA4: Get badges earned by a user
 */
export async function getUserBadges(userId: number): Promise<BadgeWithEarnedDate[]> {
    const badges = await dbAll<BadgeWithEarnedDate>(
        `SELECT b.*, ub.earned_at
         FROM badges b
         INNER JOIN user_badges ub ON b.id = ub.badge_id
         WHERE ub.user_id = ?
         ORDER BY ub.earned_at DESC`,
        [userId]
    );
    return badges;
}

/**
 * 4.2 CA2: Checks and awards badges automatically based on user activity
 * Called after each significant action (logging an action, joining a group, etc.)
 */
export async function checkAndAwardBadges(userId: number): Promise<Badge[]> {
    const newBadges: Badge[] = [];

    // Get all available badges
    const allBadges = await getAllBadges();

    // Get badges the user already has
    const userBadges = await getUserBadges(userId);
    const earnedBadgeIds = userBadges.map(b => b.id);

    // Check each badge
    for (const badge of allBadges) {
        // Skip if already earned
        if (earnedBadgeIds.includes(badge.id)) continue;

        // Check if meets requirements
        const meetsRequirement = await checkBadgeRequirement(userId, badge);

        if (meetsRequirement) {
            // Award badge
            await awardBadge(userId, badge.id);
            
            // Create notification (4.2 CA3)
            await createBadgeNotification(userId, badge);
            
            newBadges.push(badge);
        }
    }

    return newBadges;
}


// Checks if a user meets the requirement for a specific badge
async function checkBadgeRequirement(userId: number, badge: Badge): Promise<boolean> {
    switch (badge.requirement_type) {
        case RequirementType.ACTIONS_COUNT: {
            // Check total number of actions from activities table
            const result = await dbGet<{ count: number }>(
                'SELECT COUNT(*) as count FROM activities WHERE user_id = ?',
                [userId]
            );
            return (result?.count || 0) >= badge.requirement;
        }

        case RequirementType.STREAK_DAYS: {
            // Check current streak
            const user = await dbGet<{ current_streak: number }>(
                'SELECT current_streak FROM users WHERE id = ?',
                [userId]
            );
            return (user?.current_streak || 0) >= badge.requirement;
        }

        case RequirementType.GROUP_JOIN: {
            // Check if joined a group
            const result = await dbGet<{ count: number }>(
                'SELECT COUNT(*) as count FROM group_members WHERE user_id = ?',
                [userId]
            );
            return (result?.count || 0) >= badge.requirement;
        }

        case RequirementType.CATEGORY_COUNT: {
            // Check actions by category from activities table
            if (!badge.category) return false;
            const result = await dbGet<{ count: number }>(
                'SELECT COUNT(*) as count FROM activities WHERE user_id = ? AND activity_type = ?',
                [userId, badge.category]
            );
            return (result?.count || 0) >= badge.requirement;
        }

        case RequirementType.SPECIAL_EVENT: {
            // Special events require special logic
            // For now returns false, can be implemented as needed
            return false;
        }

        default:
            return false;
    }
}

/**
 * CA2: Otorga un badge a un usuario
 */
async function awardBadge(userId: number, badgeId: number): Promise<void> {
    await dbRun(
        'INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
        [userId, badgeId]
    );
}

/**
 * CA3: Crea una notificación cuando se gana un badge
 */
async function createBadgeNotification(userId: number, badge: Badge): Promise<void> {
    await dbRun(
        `INSERT INTO notifications (user_id, type, title, message, badge_id)
         VALUES (?, 'badge_earned', ?, ?, ?)`,
        [
            userId,
            '🎉 ¡Nueva Insignia Desbloqueada!',
            `¡Felicitaciones! Has ganado "${badge.name}" (+${badge.points} pts)`,
            badge.id
        ]
    );
}

/**
 * CA3: Obtiene las notificaciones de un usuario
 */
export async function getUserNotifications(userId: number, unreadOnly: boolean = false): Promise<Notification[]> {
    let query = `
        SELECT n.*, b.icon, b.name as badge_name
        FROM notifications n
        LEFT JOIN badges b ON n.badge_id = b.id
        WHERE n.user_id = ?
    `;
    
    if (unreadOnly) {
        query += ' AND n.is_read = 0';
    }
    
    query += ' ORDER BY n.created_at DESC LIMIT 20';

    const notifications = await dbAll<Notification>(query, [userId]);
    return notifications;
}

/**
 * Marca una notificación como leída
 */
export async function markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
    await dbRun(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [notificationId, userId]
    );
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function markAllNotificationsAsRead(userId: number): Promise<void> {
    await dbRun(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        [userId]
    );
}

/**
 * Obtiene el conteo de notificaciones no leídas
 */
export async function getUnreadNotificationsCount(userId: number): Promise<number> {
    const result = await dbGet<{ count: number }>(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
        [userId]
    );
    return result?.count || 0;
}
