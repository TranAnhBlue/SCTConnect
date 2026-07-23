import mongoose, { Schema, Document } from 'mongoose';

export interface IUbndFeedbackResponse {
  officerName: string;
  department: string;
  officialContent: string;
  documentNumber?: string;
  responseDate: string;
  resultImageUrl?: string;
}

export interface IFeedback extends Document {
  title: string;
  description: string;
  address: string;
  category: 'security' | 'construction' | 'civilization' | 'environment' | 'traffic';
  status: 'pending' | 'processing' | 'done' | 'rejected';
  imageUrl?: string;
  departmentAssigned?: string;
  likes: number;
  comments: number;
  ubndResponse?: IUbndFeedbackResponse;
  satisfactionRating?: number;
  createdAt: Date;
}

const UbndResponseSchema = new Schema<IUbndFeedbackResponse>({
  officerName: { type: String, required: true },
  department: { type: String, required: true },
  officialContent: { type: String, required: true },
  documentNumber: { type: String },
  responseDate: { type: String, default: () => new Date().toLocaleString('vi-VN') },
  resultImageUrl: { type: String },
});

const FeedbackSchema = new Schema<IFeedback>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    category: {
      type: String,
      enum: ['security', 'construction', 'civilization', 'environment', 'traffic'],
      default: 'environment',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'rejected'],
      default: 'pending',
    },
    imageUrl: { type: String },
    departmentAssigned: { type: String, default: 'Bộ phận Địa chính - Xây dựng & Đô thị UBND Xã' },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    ubndResponse: { type: UbndResponseSchema },
    satisfactionRating: { type: Number },
  },
  { timestamps: true }
);

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
