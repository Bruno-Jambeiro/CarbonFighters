import { sign, verify, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION || '1h') as SignOptions['expiresIn'];

interface TokenPayload {
    id: number,
    email: string,
}

export function generateToken(payload: TokenPayload): string {
    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export function verifyToken(token: string): TokenPayload {
    return verify(token, JWT_SECRET) as TokenPayload;
}