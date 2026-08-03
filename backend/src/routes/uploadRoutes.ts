import { Router } from 'express';
import { uploadMedia } from '../controllers/uploadController';

const router = Router();

router.post('/', uploadMedia);

export default router;
