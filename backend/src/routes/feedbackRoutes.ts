import { Router } from 'express';
import {
  getFeedbacks,
  getFeedbackById,
  getFeedbackByCode,
  createFeedback,
  updateFeedbackStatus,
  updateUbndResponse,
  rateSatisfaction,
  getReportStats,
  getDistrictMapReports,
} from '../controllers/feedbackController';

const router = Router();

router.get('/', getFeedbacks);
router.get('/stats', getReportStats);
router.get('/map-districts', getDistrictMapReports);
router.get('/code/:code', getFeedbackByCode);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id/status', updateFeedbackStatus);
router.put('/:id/ubnd-response', updateUbndResponse);
router.post('/:id/rate', rateSatisfaction);

export default router;
