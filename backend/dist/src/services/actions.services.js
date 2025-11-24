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
exports.actionsService = void 0;
const db_service_1 = require("./db.service");
const streak_service_1 = require("./streak.service");
const badge_service_1 = require("./badge.service");
class ActionsService {
    create(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Insert the action and return inserted row
            const result = yield (0, db_service_1.dbRun)(`INSERT INTO activities 
            (activity_type, activity_title, activity_description, activity_date, user_id, imagem_path) 
            VALUES (?, ?, ?, ?, ?, ?)`, [data.activity_type, data.activity_title, data.activity_description, data.activity_date, userId, data.imagem_path]);
            const id = result.lastID;
            if (!id)
                throw new Error('Failed to create action');
            const created = yield (0, db_service_1.dbGet)('SELECT * FROM activities WHERE id = ?', [id]);
            if (!created)
                throw new Error('Action not found after insert');
            // 🔥 Update user streak automatically
            try {
                yield streak_service_1.streakService.updateStreakOnActivity(userId);
            }
            catch (error) {
                console.error('Error updating streak:', error);
                // Don't fail the action creation if streak update fails
            }
            // 🎯 Check and award badges automatically
            try {
                yield (0, badge_service_1.checkAndAwardBadges)(userId);
            }
            catch (error) {
                console.error('Error checking badges:', error);
                // Don't fail the action creation if badge check fails
            }
            return created;
        });
    }
    listByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_service_1.dbAll)('SELECT * FROM activities WHERE user_id = ? ORDER BY id DESC', [userId]);
        });
    }
    /**
     * Gets activity statistics for a user
     * Useful for dashboard and profile display
     */
    getUserStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get total actions count
            const totalResult = yield (0, db_service_1.dbGet)('SELECT COUNT(*) as count FROM activities WHERE user_id = ?', [userId]);
            // Get actions by category
            const categoryResults = yield (0, db_service_1.dbAll)('SELECT activity_type, COUNT(*) as count FROM activities WHERE user_id = ? GROUP BY activity_type', [userId]);
            // Get recent actions (last 5)
            const recentActions = yield (0, db_service_1.dbAll)('SELECT * FROM activities WHERE user_id = ? ORDER BY activity_date DESC LIMIT 5', [userId]);
            // Build category map
            const actionsByCategory = {};
            categoryResults.forEach(row => {
                actionsByCategory[row.activity_type] = row.count;
            });
            return {
                totalActions: (totalResult === null || totalResult === void 0 ? void 0 : totalResult.count) || 0,
                actionsByCategory,
                recentActions
            };
        });
    }
}
exports.actionsService = new ActionsService();
