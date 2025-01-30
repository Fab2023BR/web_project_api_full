import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import auth from '../middlewares/auth';

const router = Router();

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCardById);
router.put('/likes/:cardId', auth, likeCard);
router.delete('/likes/:cardId', auth, dislikeCard);

export default router;
