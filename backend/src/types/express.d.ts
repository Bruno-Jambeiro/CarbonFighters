// src/types/express.d.ts
import "express";
import {TokenPayload} from "../services/token.service";

declare module "express-serve-static-core" {
    interface Request {
        tokenPayload?: TokenPayload;
    }
}
