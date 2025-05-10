import { Request, Response } from "express";
import prisma from "../config/prisma";

export const registerSurerAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, companyId } = req.body;

    } catch (error) {

    }
}