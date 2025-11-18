import { Response } from 'express';
import { groupService } from '../services/group.service';
import { AuthRequest } from '../types/AuthRequest';
import { actionsService } from '../services/actions.services';
import fs from 'fs';
import path from 'path';

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

    public async getGroupActions(req: AuthRequest, res: Response): Promise<void> {
        // Handle GET /groups/:groupId/actions
        // Gets all actions performed by members of a specific group.

        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'User not authenticated.' });
                return;
            }

            // Parse and validate groupId
            const groupId = parseInt(req.params.groupId, 10);
            if (isNaN(groupId)) {
                res.status(400).json({ message: 'Invalid group ID.' });
                return;
            }

            // Authorization: Verify user is a member of this group
            const myGroups = await groupService.findGroupsByUserId(userId);
            const isMember = myGroups.some(g => g.id === groupId);

            if (!isMember) {
                res.status(403).json({ message: 'You are not a member of this group.' });
                return;
            }

            // Fetch actions from the service
            const actions = await actionsService.listByGroup(groupId);

            // Convert image paths to base64 for frontend
            const actionsWithImages = actions.map(action => {
                let base64Image = '';

                try {
                    const imagePath = path.join(__dirname, '..', '..', 'data', 'images', action.imagem_path);
                    if (fs.existsSync(imagePath)) {
                        const imageBuffer = fs.readFileSync(imagePath);
                        base64Image = imageBuffer.toString('base64');
                    }
                } catch (err) {
                    console.error('Error reading image for action', action.id, err);
                }

                return {
                    id: action.id,
                    activity_type: action.activity_type,
                    activity_title: action.activity_title,
                    activity_description: action.activity_description,
                    activity_date: action.activity_date,
                    user_id: action.user_id,
                    firstName: action.firstName,
                    lastName: action.lastName,
                    image: base64Image,
                    validated: action.validated_by !== null && action.validated_by !== undefined
                };
            });

            res.status(200).json(actionsWithImages);

        } catch (error) {
            console.error(error);
            const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            res.status(500).json({ message: 'Error fetching group actions.', error: message });
        }
    }
}

export const groupController = new GroupController();