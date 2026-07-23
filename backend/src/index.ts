import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import communityRoutes from './routes/communityRoutes';
import notificationRoutes from './routes/notificationRoutes';
import messageRoutes from './routes/messageRoutes';
import serviceRoutes from './routes/serviceRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB Atlas
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    server: 'SCTConnect Fullstack Backend API (Node.js + Express + MongoDB Atlas)',
    modules: ['auth', 'feedbacks', 'community', 'notifications', 'messages', 'services'],
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
  console.log(`💬 Community:    http://localhost:${PORT}/api/v1/posts`);
  console.log(`🔔 Notify:       http://localhost:${PORT}/api/v1/notifications`);
  console.log(`✉️ Chat Messages: http://localhost:${PORT}/api/v1/messages/conversations`);
  console.log(`🛠️ Services:     http://localhost:${PORT}/api/v1/services`);
  console.log(`====================================================`);
});
