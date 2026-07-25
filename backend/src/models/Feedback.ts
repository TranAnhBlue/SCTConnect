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
  category:
    | 'supervision'
    | 'welfare'
    | 'ethnicity_religion'
    | 'youth_field'
    | 'women_field'
    | 'veterans_field'
    | 'union_field'
    | 'farmer_field'
    | 'security'
    | 'environment'
    | 'construction'
    | 'civilization'
    | 'traffic';
  targetOrganization?: 'mttq' | 'youth' | 'women' | 'veterans' | 'union' | 'farmers';
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
      default: 'supervision',
    },
    targetOrganization: {
      type: String,
      enum: ['mttq', 'youth', 'women', 'veterans', 'union', 'farmers'],
      default: 'mttq',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'rejected'],
      default: 'pending',
    },
    imageUrl: { type: String },
    departmentAssigned: { type: String, default: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã' },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    ubndResponse: { type: UbndResponseSchema },
    satisfactionRating: { type: Number },
  },
  { timestamps: true }
);

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
