"use strict";
/**
 * Streak Service
 * Manages user streaks with a flexible, non-overwhelming system
 *
 * Rules:
 * - Streak continues if user posts an activity within 3 days
 * - Streak increments only once per day (first activity of the day)
 * - Streak resets after 3 days of inactivity
 * - Updates automatically when activities are created
 */
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
exports.streakService = exports.StreakService = void 0;
const db_service_1 = require("./db.service");
const STREAK_GRACE_PERIOD_DAYS = 3; // User has 3 days to maintain streak
class StreakService {
    /**
     * Updates user streak when they create a new activity
     * Called automatically after posting an activity
     *
     * @param userId - The user ID
     * @returns Updated streak count
     */
    updateStreakOnActivity(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, db_service_1.dbGet)('SELECT current_streak, last_action_date FROM users WHERE id = ?', [userId]);
            if (!user) {
                throw new Error('User not found');
            }
            const today = this.getTodayDate();
            const currentStreak = user.current_streak || 0;
            const lastActionDate = user.last_action_date;
            let newStreak = currentStreak;
            if (!lastActionDate) {
                // First activity ever - start streak
                newStreak = 1;
            }
            else if (lastActionDate === today) {
                // Already posted today - no change
                return currentStreak;
            }
            else {
                const daysSinceLastAction = this.getDaysDifference(lastActionDate, today);
                if (daysSinceLastAction <= STREAK_GRACE_PERIOD_DAYS) {
                    // Within grace period - increment streak
                    newStreak = currentStreak + 1;
                }
                else {
                    // Streak broken - reset to 1
                    newStreak = 1;
                }
            }
            // Update database
            yield (0, db_service_1.dbRun)('UPDATE users SET current_streak = ?, last_action_date = ? WHERE id = ?', [newStreak, today, userId]);
            return newStreak;
        });
    }
    /**
     * Gets current streak information for a user
     *
     * @param userId - The user ID
     * @returns Streak information including status
     */
    getStreakInfo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, db_service_1.dbGet)('SELECT current_streak, last_action_date FROM users WHERE id = ?', [userId]);
            if (!user) {
                throw new Error('User not found');
            }
            const currentStreak = user.current_streak || 0;
            const lastActionDate = user.last_action_date;
            let isActive = false;
            if (lastActionDate) {
                const today = this.getTodayDate();
                const daysSinceLastAction = this.getDaysDifference(lastActionDate, today);
                isActive = daysSinceLastAction <= STREAK_GRACE_PERIOD_DAYS;
            }
            return {
                current_streak: currentStreak,
                last_action_date: lastActionDate,
                is_active: isActive
            };
        });
    }
    /**
     * Checks if a user's streak is about to expire (warning system)
     *
     * @param userId - The user ID
     * @returns Object with warning status and days remaining
     */
    getStreakWarning(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, db_service_1.dbGet)('SELECT last_action_date FROM users WHERE id = ?', [userId]);
            if (!user || !user.last_action_date) {
                return { warning: false, daysRemaining: 0 };
            }
            const today = this.getTodayDate();
            const daysSinceLastAction = this.getDaysDifference(user.last_action_date, today);
            const daysRemaining = STREAK_GRACE_PERIOD_DAYS - daysSinceLastAction;
            return {
                warning: daysRemaining <= 1 && daysRemaining > 0,
                daysRemaining: Math.max(0, daysRemaining)
            };
        });
    }
    /**
     * Gets today's date in YYYY-MM-DD format
     */
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }
    /**
     * Calculates the difference in days between two dates
     *
     * @param date1 - First date (YYYY-MM-DD)
     * @param date2 - Second date (YYYY-MM-DD)
     * @returns Number of days difference
     */
    getDaysDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
}
exports.StreakService = StreakService;
exports.streakService = new StreakService();
