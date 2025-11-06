// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/token.service';

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        req.tokenPayload = verifyToken(token); //Attach the decoded token payload to the request object
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
