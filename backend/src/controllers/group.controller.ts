import { Response } from 'express';
import { groupService } from '../services/group.service';
import { AuthRequest } from '../types/AuthRequest';

class GroupController {
    
    public async createGroup(req: AuthRequest, res: Response): Promise<void> {
        // Handle POST /groups
        // Creates a new group.

        try {
            const { name } = req.body;
            const userId = req.user?.id;

            // Validation
            if (!name) {
                res.status(400).json({ message: 'Group name is required.' });
                return;
            }
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated.' });
                return;
            }

            // Call Service
            const newGroup = await groupService.createGroup(name, userId);

            // Send Response
            res.status(201).json(newGroup);

        } catch (error) {
            console.error(error);
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            res.status(500).json({ message: 'Error creating group.', error: message });
        }
    }
    
    public async joinGroup(req: AuthRequest, res: Response): Promise<void> {
        // Handle POST /groups/join
        // Joins a group using an invite code.

        try {
            const { inviteCode } = req.body;
            const userId = req.user?.id;

            // Validation
            if (!inviteCode) {
                res.status(400).json({ message: 'Invite code is required.' });
                return;
            }
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated.' });
                return;
            }

            // Call Service
            const newMember = await groupService.joinGroup(inviteCode, userId);

            // Send Response
            res.status(200).json({ message: 'Successfully joined group!', membership: newMember });

        } catch (error) {
            console.error(error);
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            
            // Handle specific errors from the service
            if (message.includes('Invalid invite code') || message.includes('already a member')) {
                res.status(400).json({ message });
            } else {
                res.status(500).json({ message: 'Error joining group.', error: message });
            }
        }
    }
    
    public async getMyGroups(req: AuthRequest, res: Response): Promise<void> {
        // Handle GET /groups/my-groups
        // Gets all groups for the currently logged-in user.

        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated.' });
                return;
            }

            const groups = await groupService.findGroupsByUserId(userId);
            res.status(200).json(groups);

        } catch (error) {
            console.error(error);
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            res.status(500).json({ message: 'Error fetching groups.', error: message });
        }
    }
}

export const groupController = new GroupController();