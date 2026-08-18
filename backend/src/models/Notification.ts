import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  body: string;
  type: 'feedback_update' | 'ubnd_dispatch' | 'system' | 'news' | 'report_responded' | 'reception_approved';
  referenceId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['feedback_update', 'ubnd_dispatch', 'system', 'news', 'report_responded', 'reception_approved'],
      default: 'system',
    },
    referenceId: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);
