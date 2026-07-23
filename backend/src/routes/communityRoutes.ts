import { Router } from 'express';
import { getPosts, createPost, likePost, votePoll } from '../controllers/communityController';

const router = Router();

router.get('/', getPosts);
router.post('/', createPost);
router.post('/:id/like', likePost);
router.post('/:id/vote', votePoll);

export default router;
