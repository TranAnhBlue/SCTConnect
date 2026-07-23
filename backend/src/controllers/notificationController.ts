import { Request, Response } from 'express';
import { NotificationModel } from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const list = await NotificationModel.find().sort({ createdAt: -1 });
    const unreadCount = await NotificationModel.countDocuments({ isRead: false });
    return res.json({ success: true, count: list.length, unreadCount, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await NotificationModel.updateMany({ isRead: false }, { isRead: true });
    return res.json({ success: true, message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
