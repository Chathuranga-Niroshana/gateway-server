import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
} from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/create', authMiddleware, createUser)
router.get('/all', authMiddleware, getAllUsers)
router.get('/one/:id', authMiddleware, getUserById)
router.patch('/update/:id', authMiddleware, updateUser)
router.delete('/delete/:id', authMiddleware, deleteUser)

export default router;