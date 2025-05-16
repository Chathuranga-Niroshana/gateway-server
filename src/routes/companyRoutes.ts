import { Router } from "express";
import {
    addCompany,
    deleteCompany,
    getAllCompanies,
    getCompanyById,
    getCompanyGrowthByMonth,
    getCompanyStatistics,
    updateCompany
} from "../controllers/companyController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ROLES } from "../constants/roles";
import { authorizeRole } from "../middlewares/authorizeRole";

const router = Router()

router.post('/create', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), addCompany)
router.get('/all', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getAllCompanies)
router.get('/growth', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getCompanyGrowthByMonth)
router.get('/statistics', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getCompanyStatistics)
router.get('/one/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getCompanyById)
router.patch('/update/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), updateCompany)
router.delete('/delete/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), deleteCompany)

export default router;