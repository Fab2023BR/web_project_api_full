import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.get('/me', auth, getUsers);
router.get('/me/:userId', auth, getUserById);
router.patch('/me', auth, updateUserProfile);
router.patch('/me/avatar', auth, updateUserAvatar);

export default router;
