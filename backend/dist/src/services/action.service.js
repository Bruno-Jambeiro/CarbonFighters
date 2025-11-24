"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createAction = createAction;
exports.getUserActions = getUserActions;
exports.getUserActionStats = getUserActionStats;
exports.checkAndResetStreaks = checkAndResetStreaks;
const db_service_1 = require("./db.service");
const badgeService = __importStar(require("./badge.service"));
/**
 * Creates a new sustainable action and updates the user's streak
 * 4.1 AC3: The streak count must increment by one when the user logs their first action of a new calendar day.
 */
function createAction(userId_1, actionType_1, description_1) {
    return __awaiter(this, arguments, void 0, function* (userId, actionType, description, carbonSaved = 0, points = 10, actionDate) {
        // If no date is provided, use the current date
        const date = actionDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        // Insert the action
        const result = yield (0, db_service_1.dbRun)(`INSERT INTO sustainable_actions (user_id, action_type, description, carbon_saved, points, action_date)
        VALUES (?, ?, ?, ?, ?, ?)`, [userId, actionType, description, carbonSaved, points, date]);
        if (!result.lastID)
            return null;
        // Update the user's streak
        yield updateUserStreak(userId, date);
        // Check and award badges automatically
        yield badgeService.checkAndAwardBadges(userId);
        // Get the created action
        const action = yield (0, db_service_1.dbGet)('SELECT * FROM sustainable_actions WHERE id = ?', [result.lastID]);
        return action || null;
    });
}
/**
 * Actually updates the user's streak based on the action date.
 * 4.1 AC1: The system must track the number of consecutive days that a user logs at least one sustainable action.
 * 4.1 AC3: The streak count must increment by one when the user logs their first action of a new calendar day.
 * 4.1 AC4: If a user does not log any action for an entire calendar day, the streak must reset to zero.
 */
function updateUserStreak(userId, actionDate) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the user's last action date and current streak
        const user = yield (0, db_service_1.dbGet)('SELECT last_action_date, current_streak FROM users WHERE id = ?', [userId]);
        if (!user)
            return;
        const lastActionDate = user.last_action_date;
        const currentStreak = user.current_streak || 0;
        // If there is no last action date, this is the first action
        if (!lastActionDate) {
            yield (0, db_service_1.dbRun)('UPDATE users SET current_streak = 1, last_action_date = ? WHERE id = ?', [actionDate, userId]);
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
        }
        else if (diffDays === 1) {
            // Consecutive day - increment streak (AC3)
            yield (0, db_service_1.dbRun)('UPDATE users SET current_streak = ?, last_action_date = ? WHERE id = ?', [currentStreak + 1, actionDate, userId]);
        }
        else {
            // Skipped days - reset streak (AC4)
            yield (0, db_service_1.dbRun)('UPDATE users SET current_streak = 1, last_action_date = ? WHERE id = ?', [actionDate, userId]);
        }
    });
}
// Gets all actions of a user
function getUserActions(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const actions = yield (0, db_service_1.dbAll)('SELECT * FROM sustainable_actions WHERE user_id = ? ORDER BY action_date DESC, created_at DESC', [userId]);
        return actions;
    });
}
//Gets the action statistics of a user
function getUserActionStats(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield (0, db_service_1.dbGet)(`SELECT 
            COUNT(*) as total_actions,
            COALESCE(SUM(carbon_saved), 0) as total_carbon_saved,
            COALESCE(SUM(points), 0) as total_points
         FROM sustainable_actions 
         WHERE user_id = ?`, [userId]);
        const user = yield (0, db_service_1.dbGet)('SELECT current_streak FROM users WHERE id = ?', [userId]);
        return {
            total_actions: (stats === null || stats === void 0 ? void 0 : stats.total_actions) || 0,
            total_carbon_saved: (stats === null || stats === void 0 ? void 0 : stats.total_carbon_saved) || 0,
            total_points: (stats === null || stats === void 0 ? void 0 : stats.total_points) || 0,
            current_streak: (user === null || user === void 0 ? void 0 : user.current_streak) || 0
        };
    });
}
// Checks and updates the streaks of all users
// (Run daily as a cron job for AC4)
function checkAndResetStreaks() {
    return __awaiter(this, void 0, void 0, function* () {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        // Reset streak for users who did not log an action yesterday
        yield (0, db_service_1.dbRun)(`UPDATE users 
         SET current_streak = 0 
         WHERE last_action_date < ? 
         AND current_streak > 0`, [yesterday]);
    });
}
