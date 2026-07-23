import { Request, Response } from 'express';
import { MessageModel } from '../models/Message';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: messages.length, data: messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, senderName, recipientId, recipientName, text, attachmentUrl } = req.body;

    const message = await MessageModel.create({
      senderId: senderId || 'user_1',
      senderName: senderName || 'Người dân',
      recipientId: recipientId || 'officer_1',
      recipientName: recipientName || 'Cán bộ UBND Xã',
      text,
      attachmentUrl,
    });

    return res.status(201).json({ success: true, data: message });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
