import { Request, Response } from "express";


const addCompany = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            companyRegNo,
            email,
            mobileNo,
            address,
            name,
            baseUrl
        } = req.body
    } catch (error) {

    }
}