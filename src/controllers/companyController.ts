import { Request, Response } from "express";
import prisma from "../config/prisma";
import { Company } from "@prisma/client";

export const addCompany = async (req: Request, res: Response): Promise<void> => {
    try {
        const { companyRegNo, email, mobileNo, address, name, baseUrl } = req.body;
        const existCompany = await prisma.company.findUnique({
            where: { email: email }
        })
        if (existCompany) {
            res.status(400).json({ message: "Company with this email already exists." });
            return;
        }
        const companyWithSameUrl = await prisma.company.findUnique({
            where: { baseUrl: baseUrl }
        })
        if (companyWithSameUrl) {
            res.status(400).json({ message: "Company with this base url already exists." });
            return;
        }
        const newCompany = await prisma.company.create({
            data: {
                companyRegNo, email, mobileNo, address, name, baseUrl
            }
        })
        res.status(201).json({ message: 'Company created successfully.', company: newCompany.id })
    } catch (error) {
        console.error("Error adding company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllCompanies = async (req: Request, res: Response): Promise<void> => {
    try {
        const companies = await prisma.company.findMany()
        res.status(200).json(companies)
    } catch (error) {
        console.error("Error getting company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const companyID = Number(id)
        const company = await prisma.company.findUnique({ where: { id: companyID } })
        if (!company) {
            res.status(404).json({ message: "Company Not Found" })
        } else {
            res.status(200).json(company)
        }
    } catch (error) {
        console.error("Error getting company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;
        const companyId = Number(id);

        const existingCompany = await prisma.company.findUnique({ where: { id: companyId } })
        if (!existingCompany) {
            res.status(404).json({ message: "Company Not Found" })
            return;
        }

        if (data.email && data.email !== existingCompany.email) {
            const emailTaken = await prisma.company.findUnique({ where: { email: data.email } })
            if (emailTaken) {
                res.status(400).json({ message: "Another company already using this email" })
                return;
            }
        }

        if (data.baseUrl && data.baseUrl !== existingCompany.baseUrl) {
            const baseUrlTaken = await prisma.company.findUnique({ where: { baseUrl: data.baseUrl } })
            if (baseUrlTaken) {
                res.status(400).json({ message: "Another company already using this base url." })
                return;
            }
        }
        await prisma.company.update({
            where: { id: companyId },
            data
        })

        res.status(200).json({ message: "Company Updated Successfully." })

    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        const companyId = Number(id)
        const existingCompany = await prisma.company.findUnique({ where: { id: companyId } })
        if (!existingCompany) {
            res.status(404).json({ message: "Company Not Found" })
            return;
        }
        await prisma.company.delete({ where: { id: companyId } })
        res.status(200).json({ message: "Company Deleted Successfully." })
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}