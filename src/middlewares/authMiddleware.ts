import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddlewware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Invalid token' });

    try {
        const token = authHeader.split(' ')[1];
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Not Authorized.', error: error })
    }

}