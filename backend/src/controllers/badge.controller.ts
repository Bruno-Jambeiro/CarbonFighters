import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as badgeService from '../services/badge.service';


//Get all available badges

export async function getAllBadges(req: AuthRequest, res: Response) {
    try {
        const badges = await badgeService.getAllBadges();
        return res.status(200).json({ badges });
    } catch (err) {
        console.error('Error fetching badges:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}


//Get badges earned by the authenticated user

export async function getMyBadges(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const badges = await badgeService.getUserBadges(userId);
        return res.status(200).json({ badges, count: badges.length });
    } catch (err) {
        console.error('Error fetching user badges:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Get the user's notifications

export async function getMyNotifications(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const unreadOnly = req.query.unread === 'true';
        const notifications = await badgeService.getUserNotifications(userId, unreadOnly);
        const unreadCount = await badgeService.getUnreadNotificationsCount(userId);

        return res.status(200).json({
            notifications,
            unreadCount
        });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Mark a notification as read

export async function markNotificationRead(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { id } = req.params;
        await badgeService.markNotificationAsRead(parseInt(id), userId);

        return res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Mark all notifications as read
export async function markAllNotificationsRead(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        await badgeService.markAllNotificationsAsRead(userId);

        return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('Error marking all notifications as read:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}
