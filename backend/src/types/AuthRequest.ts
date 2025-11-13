import { Request } from 'express';
import { TokenPayload } from '../services/token.service';

export interface AuthRequest extends Request {
    // Use the imported TokenPayload interface for the user property
    user?: TokenPayload;
}