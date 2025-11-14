import { Response } from 'express';
import { actionsService } from '../services/actions.services';
import { AuthRequest } from '../types/AuthRequest';
import fs from 'fs';
import path from 'path';

class ActionsController {
    public async create(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({ error: 'Image file is required' });
            }

            const { activity_type, activity_title, activity_description, activity_date } = req.body;

            // Validate required fields
            if (!activity_type || typeof activity_type !== 'string') {
                return res.status(400).json({ error: 'activity_type is required and must be a string' });
            }
            if (!activity_title || typeof activity_title !== 'string') {
                return res.status(400).json({ error: 'activity_title is required and must be a string' });
            }
            if (!activity_description || typeof activity_description !== 'string') {
                return res.status(400).json({ error: 'activity_description is required and must be a string' });
            }
            if (!activity_date) {
                return res.status(400).json({ error: 'activity_date is required' });
            }

            // Store relative path to the image
            const imagePath = req.file.filename;

            const created = await actionsService.create(userId, {
                activity_type,
                activity_title,
                activity_description,
                activity_date,
                imagem_path: imagePath
            });

            return res.status(201).json(created);
        } catch (err) {
            console.error('Error creating action', err);
            // Clean up uploaded file if there was an error
            if (req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Error deleting file:', unlinkErr);
                });
            }
            return res.status(500).json({ error: 'Server error' });
        }
    }

    public async myActions(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const actions = await actionsService.listByUser(userId);

            // Convert image paths to base64 for frontend compatibility
            const actionsWithBase64 = actions.map(action => {
                try {
                    const imagePath = path.join(__dirname, '..', '..', 'data', 'images', action.imagem_path);
                    if (fs.existsSync(imagePath)) {
                        const imageBuffer = fs.readFileSync(imagePath);
                        const base64Image = imageBuffer.toString('base64');
                        return {
                            ...action,
                            image: base64Image,
                            validated: action.validated_by !== null && action.validated_by !== undefined
                        };
                    }
                    return {
                        ...action,
                        image: '',
                        validated: action.validated_by !== null && action.validated_by !== undefined
                    };
                } catch (err) {
                    console.error('Error reading image:', err);
                    return {
                        ...action,
                        image: '',
                        validated: action.validated_by !== null && action.validated_by !== undefined
                    };
                }
            });

            return res.status(200).json(actionsWithBase64);
        } catch (err) {
            console.error('Error listing actions', err);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

export const actionsController = new ActionsController();

