import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import { streakService } from '../services/streak.service';
import { actionsService } from '../services/actions.services';
import { getUserBadges } from '../services/badge.service';
import { groupService } from '../services/group.service';

/**
 * User Profile Controller
 * Handles user profile information including streaks, stats, and badges
 */

/**
 * Get comprehensive user profile data
 * Includes: streak info, activity stats, badges, groups
 */
export async function getUserProfile(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Fetch all profile data in parallel for better performance
        const [streakInfo, activityStats, badges, groups] = await Promise.all([
            streakService.getStreakInfo(userId),
            actionsService.getUserStats(userId),
            getUserBadges(userId),
            groupService.findGroupsByUserId(userId)
        ]);

        // Get streak warning if applicable
        const streakWarning = await streakService.getStreakWarning(userId);

        return res.status(200).json({
            streak: {
                ...streakInfo,
                warning: streakWarning
            },
            stats: activityStats,
            badges: badges.length,
            badgesList: badges.slice(0, 5), // Most recent 5 badges
            groups: groups.length
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Failed to fetch profile data' });
    }
}

/**
 * Get detailed streak information
 */
export async function getStreakDetails(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const streakInfo = await streakService.getStreakInfo(userId);
        const streakWarning = await streakService.getStreakWarning(userId);

        return res.status(200).json({
            ...streakInfo,
            warning: streakWarning,
            grace_period_days: 3,
            message: getStreakMessage(streakInfo.current_streak, streakWarning.daysRemaining)
        });
    } catch (error) {
        console.error('Error fetching streak details:', error);
        return res.status(500).json({ error: 'Failed to fetch streak data' });
    }
}

/**
 * Helper function to generate motivational streak messages
 */
function getStreakMessage(streak: number, daysRemaining: number): string {
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
export async function getUserStats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const stats = await actionsService.getUserStats(userId);

        return res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
}
