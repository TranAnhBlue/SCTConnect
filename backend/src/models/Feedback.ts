import mongoose, { Schema, Document, Types } from 'mongoose';

// ---- Sub-document: phản hồi của cán bộ ----
export interface IUbndFeedbackResponse {
  officerName: string;
  department: string;
  officialContent: string;
  documentNumber?: string;
  responseDate: string;
  resultImageUrl?: string;
}

// ---- Sub-document: lịch sử thay đổi trạng thái ----
export interface IStatusHistory {
  status: string;
  changedBy: string;       // tên cán bộ / 'Hệ thống'
  changedByRole?: string;
  changedAt: Date;
  note?: string;
}

// ---- Interface chính ----
export interface IFeedback extends Document {
  // Định danh
  reportCode: string;           // Mã phản ánh: PA-20260814-001

  // Nội dung
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

  // Phân loại & phân công
  targetOrganization?: 'mttq' | 'youth' | 'women' | 'veterans' | 'union' | 'farmers';
  departmentAssigned?: string;
  assignedOfficerId?: Types.ObjectId;   // ref → User

  // Trạng thái
  status: 'pending' | 'processing' | 'done' | 'rejected';
  priority: 'normal' | 'urgent';
  deadline?: Date;                      // hạn xử lý theo luật
  isOverdue: boolean;
  statusHistory: IStatusHistory[];

  // Media
  imageUrl?: string;                    // ảnh đơn (backward compat)
  imageUrls: string[];                  // nhiều ảnh
  videoUrl?: string;

  // Vị trí GPS
  gps?: {
    lat: number;
    lng: number;
  };

  // Người gửi
  userId?: Types.ObjectId;              // ref → User (null nếu ẩn danh)
  isAnonymous: boolean;
  reporterName?: string;
  reporterPhone?: string;

  // Phản hồi & đánh giá
  ubndResponse?: IUbndFeedbackResponse;
  satisfactionRating?: number;          // 1–5 sao
  satisfactionComment?: string;

  // Tương tác
  likes: number;
  comments: number;

  createdAt: Date;
  updatedAt: Date;
}

// ---- Sub-schemas ----
const UbndResponseSchema = new Schema<IUbndFeedbackResponse>({
  officerName: { type: String, required: true },
  department: { type: String, required: true },
  officialContent: { type: String, required: true },
  documentNumber: { type: String },
  responseDate: { type: String, default: () => new Date().toLocaleString('vi-VN') },
  resultImageUrl: { type: String },
});

const StatusHistorySchema = new Schema<IStatusHistory>({
  status: { type: String, required: true },
  changedBy: { type: String, required: true },
  changedByRole: { type: String },
  changedAt: { type: Date, default: Date.now },
  note: { type: String },
});

// ---- Main Schema ----
const FeedbackSchema = new Schema<IFeedback>(
  {
    reportCode: {
      type: String,
      unique: true,
      default: () => {
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        return `PA-${datePart}-${rand}`;
      },
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'supervision', 'welfare', 'ethnicity_religion', 'youth_field',
        'women_field', 'veterans_field', 'union_field', 'farmer_field',
        'security', 'environment', 'construction', 'civilization', 'traffic',
      ],
      default: 'supervision',
    },

    targetOrganization: {
      type: String,
      enum: ['mttq', 'youth', 'women', 'veterans', 'union', 'farmers'],
      default: 'mttq',
    },
    departmentAssigned: { type: String, default: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã' },
    assignedOfficerId: { type: Schema.Types.ObjectId, ref: 'User' },

    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'rejected'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['normal', 'urgent'],
      default: 'normal',
    },
    deadline: { type: Date },   // set bởi controller dựa trên priority
    isOverdue: { type: Boolean, default: false },
    statusHistory: { type: [StatusHistorySchema], default: [] },

    imageUrl: { type: String },
    imageUrls: { type: [String], default: [] },
    videoUrl: { type: String },

    gps: {
      lat: { type: Number },
      lng: { type: Number },
    },

    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: false },
    reporterName: { type: String },
    reporterPhone: { type: String },

    ubndResponse: { type: UbndResponseSchema },
    satisfactionRating: { type: Number, min: 1, max: 5 },
    satisfactionComment: { type: String },

    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh
FeedbackSchema.index({ status: 1, createdAt: -1 });
FeedbackSchema.index({ userId: 1, createdAt: -1 });
FeedbackSchema.index({ targetOrganization: 1, status: 1 });
FeedbackSchema.index({ deadline: 1, isOverdue: 1 });

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
