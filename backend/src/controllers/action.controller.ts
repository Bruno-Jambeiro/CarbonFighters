import { Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as actionService from '../services/action.service';

// Creates a new sustainable action
export async function logAction(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { action_type, description, carbon_saved, points } = req.body;

        // Basic validations
        if (!action_type || !description) {
            return res.status(400).json({ 
                error: 'action_type and description are required' 
            });
        }

        // Validate action type
        const validTypes = ['transport', 'recycling', 'water', 'energy', 'food', 'other'];
        if (!validTypes.includes(action_type)) {
            return res.status(400).json({ 
                error: `Invalid action_type. Must be one of: ${validTypes.join(', ')}` 
            });
        }

        // Create the action
        const action = await actionService.createAction(
            userId,
            action_type,
            description,
            carbon_saved || 0,
            points || 10
        );

        if (!action) {
            return res.status(500).json({ error: 'Failed to create action' });
        }

        // Get updated statistics
        const stats = await actionService.getUserActionStats(userId);

        return res.status(201).json({
            message: 'Action logged successfully',
            action,
            stats
        });
    } catch (err) {
        console.error('Error logging action:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Gets all actions of the authenticated user
export async function getMyActions(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const actions = await actionService.getUserActions(userId);

        return res.status(200).json({
            actions,
            count: actions.length
        });
    } catch (err) {
        console.error('Error fetching actions:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Gets the authenticated user's statistics
// AC2: The user's main dashboard must visually display the current streak count
export async function getMyStats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const stats = await actionService.getUserActionStats(userId);

        return res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching stats:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}
