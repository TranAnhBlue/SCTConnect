import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  text: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    recipientId: { type: String, required: true },
    recipientName: { type: String, required: true },
    text: { type: String, required: true },
    attachmentUrl: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
