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
exports.getUserProfile = getUserProfile;
exports.getStreakDetails = getStreakDetails;
exports.getUserStats = getUserStats;
const streak_service_1 = require("../services/streak.service");
const actions_services_1 = require("../services/actions.services");
const badge_service_1 = require("../services/badge.service");
const group_service_1 = require("../services/group.service");
/**
 * User Profile Controller
 * Handles user profile information including streaks, stats, and badges
 */
/**
 * Get comprehensive user profile data
 * Includes: streak info, activity stats, badges, groups
 */
function getUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            // Fetch all profile data in parallel for better performance
            const [streakInfo, activityStats, badges, groups] = yield Promise.all([
                streak_service_1.streakService.getStreakInfo(userId),
                actions_services_1.actionsService.getUserStats(userId),
                (0, badge_service_1.getUserBadges)(userId),
                group_service_1.groupService.findGroupsByUserId(userId)
            ]);
            // Get streak warning if applicable
            const streakWarning = yield streak_service_1.streakService.getStreakWarning(userId);
            return res.status(200).json({
                streak: Object.assign(Object.assign({}, streakInfo), { warning: streakWarning }),
                stats: activityStats,
                badges: badges.length,
                badgesList: badges.slice(0, 5), // Most recent 5 badges
                groups: groups.length
            });
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            return res.status(500).json({ error: 'Failed to fetch profile data' });
        }
    });
}
/**
 * Get detailed streak information
 */
function getStreakDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const streakInfo = yield streak_service_1.streakService.getStreakInfo(userId);
            const streakWarning = yield streak_service_1.streakService.getStreakWarning(userId);
            return res.status(200).json(Object.assign(Object.assign({}, streakInfo), { warning: streakWarning, grace_period_days: 3, message: getStreakMessage(streakInfo.current_streak, streakWarning.daysRemaining) }));
        }
        catch (error) {
            console.error('Error fetching streak details:', error);
            return res.status(500).json({ error: 'Failed to fetch streak data' });
        }
    });
}
/**
 * Helper function to generate motivational streak messages
 */
function getStreakMessage(streak, daysRemaining) {
    if (streak === 0) {
        return '🌱 Start your streak by posting your first eco-action!';
    }
    if (daysRemaining <= 1 && daysRemaining > 0) {
        return `⚠️ Your ${streak}-day streak is about to expire! Post an action to keep it going.`;
    }
    if (streak < 7) {
        return `🔥 ${streak}-day streak! Keep it up!`;
    }
    if (streak < 30) {
        return `🔥🔥 Amazing ${streak}-day streak! You're on fire!`;
    }
    return `🔥🔥🔥 Incredible ${streak}-day streak! You're a true eco-warrior!`;
}
/**
 * Get user activity statistics
 */
function getUserStats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const stats = yield actions_services_1.actionsService.getUserStats(userId);
            return res.status(200).json(stats);
        }
        catch (error) {
            console.error('Error fetching user stats:', error);
            return res.status(500).json({ error: 'Failed to fetch statistics' });
        }
    });
}
