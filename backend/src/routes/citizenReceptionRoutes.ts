import { Router } from 'express';
import {
  getReceptions,
  createReception,
  updateReceptionStatus,
} from '../controllers/citizenReceptionController';

const router = Router();

router.get('/', getReceptions);
router.post('/', createReception);
router.put('/:id/status', updateReceptionStatus);

export default router;
