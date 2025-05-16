import { Request, Response } from "express";
import prisma from "../config/prisma";
import { comparePassword } from "../utils/bcrypt";
import { generatedToken } from "../utils/jwt";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid email" });
            return;
        }
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        const payload: any = {
            userId: user.id,
            role: user.roleId,
        };
        if (user.companyId !== null) {
            payload.companyId = user.companyId;
        }
        const token = generatedToken(payload);
        const companyId = Number(user?.companyId)
        const userCompany = await prisma.company.findUnique({ where: { id: companyId } });
        if (userCompany && userCompany?.isActive === false) {
            res.status(401).json({ message: "Company is not active" });
            return;
        }
        res.status(200).json({
            message: "Login Successful",
            authToken: token,
            user: {
                id: user.id,
                name: user.name,
                role: user.roleId,
                companyId: user.companyId ?? null,
                baseUrl: userCompany?.baseUrl ?? null,
            }
        })
    } catch (error) {
        console.error("Error login in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}