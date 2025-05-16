import { Request, Response } from "express";
import prisma from "../config/prisma";
import { Company } from "@prisma/client";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

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

type CompanyGrowth = {
    month: string
    count: bigint
}

export const getCompanyGrowthByMonth = async (req: Request, res: Response): Promise<void> => {
    try {
        const companyGrowth = await prisma.$queryRaw<CompanyGrowth[]>`
        SELECT 
          DATE_FORMAT(createdAt, '%b') as month,
          DATE_FORMAT(createdAt, '%m') as monthNumber,
          COUNT(*) AS count
        FROM Company
        GROUP BY month, monthNumber
        ORDER BY monthNumber ASC;
      `

        const sortedGrowth = companyGrowth
            .map(item => ({
                label: item.month,
                monthNumber: Number((item as any).monthNumber),
                count: Number(item.count)
            }))
            .sort((a, b) => a.monthNumber - b.monthNumber)

        const formattedGrowth = []
        let cumulativeCount = 0

        for (const item of sortedGrowth) {
            cumulativeCount += item.count
            formattedGrowth.push({
                label: item.label,
                y: cumulativeCount
            })
        }

        res.status(200).json(formattedGrowth)
    } catch (error) {
        console.error("Error fetching company growth:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}



export const getCompanyStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalCompanyCount = await prisma.company.count()
        const activeCompanyCount = await prisma.company.count({
            where: { isActive: true },
        })

        // Get current month range
        const now = new Date()
        const startOfCurrentMonth = startOfMonth(now)
        const endOfCurrentMonth = endOfMonth(now)

        // Get last month range
        const lastMonth = subMonths(now, 1)
        const startOfLastMonth = startOfMonth(lastMonth)
        const endOfLastMonth = endOfMonth(lastMonth)

        // Count companies created in current month
        const thisMonthCount = await prisma.company.count({
            where: {
                createdAt: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth,
                },
            },
        })

        // Count companies created in last month
        const lastMonthCount = await prisma.company.count({
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        })

        // Calculate growth percentage
        const companyGrowthPercentageFromLastMonth =
            lastMonthCount === 0
                ? thisMonthCount > 0 ? 100 : 0
                : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100

        const totalUserCounts = await prisma.user.count()
        const totalRolesCounts = await prisma.role.count()

        const formatData = [
            {
                value: totalUserCounts,
                title: 'Total Users',
                subtitle: 'Across all companies',
                percentage: null,
                icon: 'user',
            },
            {
                title: 'Total Companies',
                subtitle: 'From Last month',
                value: totalCompanyCount,
                percentage: companyGrowthPercentageFromLastMonth,
                icon: 'building-office',
            },
            {
                title: 'Active Companies',
                subtitle: 'of total',
                value: activeCompanyCount,
                percentage:
                    totalCompanyCount === 0
                        ? 0
                        : (activeCompanyCount / totalCompanyCount) * 100,
                icon: 'check-circle',
            },
            {
                value: totalRolesCounts,
                title: 'User Roles',
                subtitle: 'Role types in system',
                percentage: null,
                icon: 'key',
            },
        ]

        res.status(200).json(formatData)
    } catch (error) {
        console.error('Error fetching company statistics:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
