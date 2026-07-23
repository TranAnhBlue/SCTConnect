import { Router } from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', getProfile);
router.put('/profile/:id', updateProfile);

export default router;
