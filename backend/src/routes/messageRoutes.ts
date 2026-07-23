import { Router } from 'express';
import { getConversations, sendMessage } from '../controllers/messageController';

const router = Router();

router.get('/conversations', getConversations);
router.post('/send', sendMessage);

export default router;
