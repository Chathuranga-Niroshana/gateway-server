import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: number;
                companyId?: number;
            };
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization header missing or invalid.' });
        return;
    }

    try {
        const token = authHeader.split(' ')[1];
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Not authorized.', error: error instanceof Error ? error.message : error });
    }
};
