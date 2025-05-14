import { NextFunction, Request, Response } from "express"

export const authorizeRole = (roles: number[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    };
};
