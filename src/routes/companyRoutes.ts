import { Router } from "express";
import { addCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/companyController";

const router = Router()

router.post('/create', addCompany)
router.get('/all', getAllCompanies)
router.get('/one/:id', getCompanyById)
router.patch('/update/:id', updateCompany)
router.delete('/delete/:id', deleteCompany)

export default router;