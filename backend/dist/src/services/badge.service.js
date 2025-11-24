"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBadges = getAllBadges;
exports.getUserBadges = getUserBadges;
exports.checkAndAwardBadges = checkAndAwardBadges;
exports.getUserNotifications = getUserNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
exports.getUnreadNotificationsCount = getUnreadNotificationsCount;
const badge_model_1 = require("../models/badge.model");
const db_service_1 = require("./db.service");
/**
 * 4.2 CA1: Get all predefined badges in the system
 */
function getAllBadges() {
    return __awaiter(this, void 0, void 0, function* () {
        const badges = yield (0, db_service_1.dbAll)('SELECT * FROM badges ORDER BY type, requirement');
        return badges;
    });
}
/**
 * 4.2 CA2 & CA4: Get badges earned by a user
 */
function getUserBadges(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const badges = yield (0, db_service_1.dbAll)(`SELECT b.*, ub.earned_at
         FROM badges b
         INNER JOIN user_badges ub ON b.id = ub.badge_id
         WHERE ub.user_id = ?
         ORDER BY ub.earned_at DESC`, [userId]);
        return badges;
    });
}
/**
 * 4.2 CA2: Checks and awards badges automatically based on user activity
 * Called after each significant action (logging an action, joining a group, etc.)
 */
function checkAndAwardBadges(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const newBadges = [];
        // Get all available badges
        const allBadges = yield getAllBadges();
        // Get badges the user already has
        const userBadges = yield getUserBadges(userId);
        const earnedBadgeIds = userBadges.map(b => b.id);
        // Check each badge
        for (const badge of allBadges) {
            // Skip if already earned
            if (earnedBadgeIds.includes(badge.id))
                continue;
            // Check if meets requirements
            const meetsRequirement = yield checkBadgeRequirement(userId, badge);
            if (meetsRequirement) {
                // Award badge
                yield awardBadge(userId, badge.id);
                // Create notification (4.2 CA3)
                yield createBadgeNotification(userId, badge);
                newBadges.push(badge);
            }
        }
        return newBadges;
    });
}
// Checks if a user meets the requirement for a specific badge
function checkBadgeRequirement(userId, badge) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (badge.requirement_type) {
            case badge_model_1.RequirementType.ACTIONS_COUNT: {
                // Check total number of actions from activities table
                const result = yield (0, db_service_1.dbGet)('SELECT COUNT(*) as count FROM activities WHERE user_id = ?', [userId]);
                return ((result === null || result === void 0 ? void 0 : result.count) || 0) >= badge.requirement;
            }
            case badge_model_1.RequirementType.STREAK_DAYS: {
                // Check current streak
                const user = yield (0, db_service_1.dbGet)('SELECT current_streak FROM users WHERE id = ?', [userId]);
                return ((user === null || user === void 0 ? void 0 : user.current_streak) || 0) >= badge.requirement;
            }
            case badge_model_1.RequirementType.GROUP_JOIN: {
                // Check if joined a group
                const result = yield (0, db_service_1.dbGet)('SELECT COUNT(*) as count FROM group_members WHERE user_id = ?', [userId]);
                return ((result === null || result === void 0 ? void 0 : result.count) || 0) >= badge.requirement;
            }
            case badge_model_1.RequirementType.CATEGORY_COUNT: {
                // Check actions by category from activities table
                if (!badge.category)
                    return false;
                const result = yield (0, db_service_1.dbGet)('SELECT COUNT(*) as count FROM activities WHERE user_id = ? AND activity_type = ?', [userId, badge.category]);
                return ((result === null || result === void 0 ? void 0 : result.count) || 0) >= badge.requirement;
            }
            case badge_model_1.RequirementType.SPECIAL_EVENT: {
                // Special events require special logic
                // For now returns false, can be implemented as needed
                return false;
            }
            default:
                return false;
        }
    });
}
/**
 * CA2: Otorga un badge a un usuario
 */
function awardBadge(userId, badgeId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_service_1.dbRun)('INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badgeId]);
    });
}
/**
 * CA3: Crea una notificación cuando se gana un badge
 */
function createBadgeNotification(userId, badge) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_service_1.dbRun)(`INSERT INTO notifications (user_id, type, title, message, badge_id)
         VALUES (?, 'badge_earned', ?, ?, ?)`, [
            userId,
            '🎉 ¡Nueva Insignia Desbloqueada!',
            `¡Felicitaciones! Has ganado "${badge.name}" (+${badge.points} pts)`,
            badge.id
        ]);
    });
}
/**
 * CA3: Obtiene las notificaciones de un usuario
 */
function getUserNotifications(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, unreadOnly = false) {
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
        const notifications = yield (0, db_service_1.dbAll)(query, [userId]);
        return notifications;
    });
}
/**
 * Marca una notificación como leída
 */
function markNotificationAsRead(notificationId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_service_1.dbRun)('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId]);
    });
}
/**
 * Marca todas las notificaciones como leídas
 */
function markAllNotificationsAsRead(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_service_1.dbRun)('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    });
}
/**
 * Obtiene el conteo de notificaciones no leídas
 */
function getUnreadNotificationsCount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, db_service_1.dbGet)('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', [userId]);
        return (result === null || result === void 0 ? void 0 : result.count) || 0;
    });
}
