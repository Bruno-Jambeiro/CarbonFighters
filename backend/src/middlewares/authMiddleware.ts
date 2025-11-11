import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { verifyToken } from '../services/token.service';

interface JwtPayload {
    id: number;
    email: string;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.sendStatus(401);
        return
    }
    try {
        const payload = verifyToken(token) as JwtPayload;
        req.user = { id: payload.id, email: payload.email };
        next();
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            return res.sendStatus(403);
        }
        console.error(e)
        return res.sendStatus(500);
    }
}
