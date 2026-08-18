import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import communityRoutes from './routes/communityRoutes';
import notificationRoutes from './routes/notificationRoutes';
import messageRoutes from './routes/messageRoutes';
import serviceRoutes from './routes/serviceRoutes';
import citizenReceptionRoutes from './routes/citizenReceptionRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB Atlas
connectDB();

// Middlewares bảo mật
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? ['https://sctconnect.vn'] : '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting: tối đa 100 request/15 phút mỗi IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/v1', limiter);

// Rate limiting chặt hơn cho auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau.' },
});
app.use('/api/v1/auth', authLimiter);

// Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    server: 'SCTConnect Fullstack Backend API (Node.js + Express + MongoDB Atlas)',
    modules: ['auth', 'feedbacks', 'community', 'notifications', 'messages', 'services', 'receptions', 'upload'],
    time: new Date().toISOString(),
  });
});

// Mounted Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/feedbacks', feedbackRoutes);
app.use('/api/v1/posts', communityRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/receptions', citizenReceptionRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[Server Error]:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SCTConnect Fullstack API running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`📑 Feedbacks:    http://localhost:${PORT}/api/v1/feedbacks`);
  console.log(`👤 Auth & Users:  http://localhost:${PORT}/api/v1/auth/me`);
  console.log(`📷 Upload API:   http://localhost:${PORT}/api/v1/upload`);
  console.log(`====================================================`);
});

