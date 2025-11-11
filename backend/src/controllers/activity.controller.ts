import { Request, Response } from 'express';
import * as activityService from '../services/activity.service';

export async function newActivity(req: Request, res: Response) {
    try {
        const { type, duration, time } = req.body;
        const user_id = req.user!.id

        // Basic validation
        if (!type || !duration)
            return res.status(400).json({ error: "'type' and 'duration' are required" });

        const activity = await activityService.createActivity({ type, duration, time, user_id })

        // Respond with success
        return res.status(201).json({
            message: "User registered successfully",
            data: activity,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function getUserActivities(req: Request, res: Response) {
    try {
        const user_id = parseInt(req.params.id);


        const activities = await activityService.loadUserActivities(user_id)

        // Respond with data
        return res.status(200).json(activities);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function getActivity(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);


        const activity = await activityService.loadActivity(id)

        // Respond with data
        return res.status(200).json(activity);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function deleteActivity(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);


        await activityService.removeActivity(id);

        // Respond with success
        return res.status(200);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
