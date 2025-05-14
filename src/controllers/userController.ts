import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword } from "../utils/bcrypt";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role_id, companyId } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }
        if (role_id !== 1) {
            if (!companyId) {
                res.status(400).json({ message: "Company ID is required for non-admin users." });
                return;
            }
            const existingCompany = await prisma.company.findUnique({ where: { id: companyId } });
            if (!existingCompany) {
                res.status(404).json({ message: "Company not found." });
                return;
            }
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role_id,
                companyId
            },
            select: {
                id: true,
            }
        });

        res.status(201).json({
            message: "User registered successfully.",
            userId: newUser.id
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role_id: true,
                companyId: true,
                createdAt: true
            }
        })
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;;
        const userId = Number(id)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                company: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true,
            }
        })
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;;
        const data = req.body
        const userId = Number(id)
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }

        if (data.email && data.email !== user.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email: data.email } })
            if (emailTaken) {
                res.status(400).json({ message: "Email already taken" })
                return
            }
        }

        await prisma.user.update({ where: { id: userId }, data })
        res.status(200).json({ message: "User updated successfully" })

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;;
        const userId = Number(id)
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }
        await prisma.user.delete({ where: { id: userId } })
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}