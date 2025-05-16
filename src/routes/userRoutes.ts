import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword,
    getSuperadmin,
    getCompanyAdmins,
    getCompanyEmployees,
    getRecentUsers,
    getUserDistributionStatistics,
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRole } from "../middlewares/authorizeRole";
import { ROLES } from "../constants/roles";

const router = Router();

router.post('/create', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]), createUser);
router.get('/all', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getAllUsers)
router.get('/recent/:number', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getRecentUsers)
router.get('/superadmin', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getSuperadmin)
router.get('/admin', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getCompanyAdmins)
router.get('/employee', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getCompanyEmployees)
router.get('/one/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getUserById)
router.get('/distribution', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getUserDistributionStatistics)
router.patch('/update/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), updateUser)
router.patch('/change_password/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]), updateUserPassword)
router.delete('/delete/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]), deleteUser)

export default router;