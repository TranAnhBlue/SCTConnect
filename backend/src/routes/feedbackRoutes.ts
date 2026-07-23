import { Router } from 'express';
import {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateUbndResponse,
  rateSatisfaction,
} from '../controllers/feedbackController';

const router = Router();

router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id/ubnd-response', updateUbndResponse);
router.post('/:id/rate', rateSatisfaction);

export default router;
