import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword } from "../utils/bcrypt";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, roleId, companyId } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists." });
            return;
        }
        if (roleId !== 1) {
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
                roleId,
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
                roleId: true,
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
        if (data.password) {
            data.password = await hashPassword(data.password);
        }

        await prisma.user.update({
            where: { id: userId },
            data,
        });

        await prisma.user.update({ where: { id: userId }, data })
        res.status(200).json({ message: "User updated successfully" })

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;;
        const data = req.body
        const userId = Number(id)
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }

        const hashedPassword = await hashPassword(data.password)

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: "User password updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const sendUser = (req as any).user;
        const companyId = sendUser?.companyId;
        const userRole = sendUser?.roleId;

        const userId = Number(id)
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            res.status(404).json({ message: "User not found" })
            return
        }
        if (userRole == 2 && user.companyId !== companyId) {
            res.status(403).json({ message: "You don't have permission to delete this user" })
            return
        }

        await prisma.user.delete({ where: { id: userId } })
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getSuperadmin = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { roleId: 1 },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        })
        res.status(200).send(users)
    } catch (error) {
        console.error("Error getting superadmin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCompanyAdmins = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { roleId: 2 },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                company: {
                    select: {
                        name: true,
                        isActive: true,
                    },
                },
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting admins:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCompanyEmployees = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { roleId: 3 },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                company: {
                    select: {
                        name: true,
                        isActive: true,
                    },
                },
            },
        });
        res.status(200).json(users)
    } catch (error) {
        console.error("Error getting employees:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getRecentUsers = async (req: Request, res: Response) => {
    try {
        const { number } = req.params
        const tackNumber = Number(number)

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: tackNumber,
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                company: {
                    select: {
                        name: true,
                    },
                },
                role: true
            }
        })
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting recent users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserDistributionStatistics = async (req: Request, res: Response) => {
    try {
        const superAdminsCount = await prisma.user.count({ where: { roleId: 1 } })
        const adminsCount = await prisma.user.count({ where: { roleId: 2 } })
        const employeesCount = await prisma.user.count({ where: { roleId: 3 } })

        const formatData = [
            { superadmin: superAdminsCount },
            { admin: adminsCount },
            { employee: employeesCount }
        ]
        res.status(200).json(formatData);
    } catch (error) {
        console.error("Error getting user statistics:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}