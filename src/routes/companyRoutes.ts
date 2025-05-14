import { Router } from "express";
import { addCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/companyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router()

router.post('/create', authMiddleware, addCompany)
router.get('/all', authMiddleware, getAllCompanies)
router.get('/one/:id', authMiddleware, getCompanyById)
router.patch('/update/:id', authMiddleware, updateCompany)
router.delete('/delete/:id', authMiddleware, deleteCompany)

export default router;