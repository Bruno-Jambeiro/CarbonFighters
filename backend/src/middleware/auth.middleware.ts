import { Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../services/token.service';
import { AuthRequest } from '../types/AuthRequest';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get the token from the header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        // Check if it's a Bearer token
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Token error: Invalid format.' });
        }
        const token = parts[1];

        // Verify the token using service from token.service.ts
        // Cast to the imported TokenPayload
        const payload = verifyToken(token) as TokenPayload;

        // Attach the user payload to the request
        req.user = payload;

        // Continue to the next step (the controller)
        next();

    } catch (error) {
        // This will catch errors from verifyToken (e.g., "invalid signature", "jwt expired")
        console.error('Authentication error:', (error as Error).message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
