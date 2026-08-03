import { Router } from 'express';
import { getServices, getAdminProcedureReports } from '../controllers/serviceController';

const router = Router();

router.get('/', getServices);
router.get('/admin-procedures', getAdminProcedureReports);

export default router;

