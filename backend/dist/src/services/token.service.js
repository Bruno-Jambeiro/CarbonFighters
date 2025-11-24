"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRATION = (process.env.JWT_EXPIRATION || '1h');
function generateToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}
;
function verifyToken(token) {
    return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
}
