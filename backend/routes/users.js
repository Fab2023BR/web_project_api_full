import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar, login } from "../controllers/users.js";
import { auth } from '../middlewares/auth.js'
const router = Router();

router.get("/me", auth, getUsers);
router.get("/me/:userId", auth, getUserById);
router.post("/signup", createUser);
router.patch("/me", auth, updateUserProfile);
router.patch("/me/avatar", auth, updateUserAvatar);
router.post("/signin", login);

export default router;
