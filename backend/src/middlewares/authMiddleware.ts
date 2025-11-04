import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

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
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
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
