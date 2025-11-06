// backend/src/controllers/user.controller.ts
import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function getUserDashboard(req: Request, res: Response) {
    try {
        const userId = req.tokenPayload?.id; // From auth middleware

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized - user ID not found" });
        }

        // Fetch user-specific dashboard data
        const dashboardData = await userService.getDashboardData(userId);

        if (!dashboardData) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(dashboardData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
