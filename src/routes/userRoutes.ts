import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRole } from "../middlewares/authorizeRole";
import { ROLES } from "../constants/roles";

const router = Router();

router.post('/create', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]), createUser);
router.get('/all', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getAllUsers)
router.get('/one/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), getUserById)
router.patch('/update/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), updateUser)
router.patch('/change_password/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EMPLOYEE]), updateUserPassword)
router.delete('/delete/:id', authMiddleware, authorizeRole([ROLES.SUPER_ADMIN]), deleteUser)

export default router;