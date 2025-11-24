"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const token_service_1 = require("../services/token.service");
const authMiddleware = (req, res, next) => {
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
        const payload = (0, token_service_1.verifyToken)(token);
        // Attach the user payload to the request
        req.user = payload;
        // Continue to the next step (the controller)
        next();
    }
    catch (error) {
        // This will catch errors from verifyToken (e.g., "invalid signature", "jwt expired")
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
exports.authMiddleware = authMiddleware;
