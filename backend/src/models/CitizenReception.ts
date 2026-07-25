import mongoose, { Schema, Document } from 'mongoose';

export interface ICitizenReception extends Document {
  citizenName: string;
  phone: string;
  targetLeader: string;
  desiredDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  note?: string;
  createdAt: Date;
}

const CitizenReceptionSchema = new Schema<ICitizenReception>(
  {
    citizenName: { type: String, required: true },
    phone: { type: String, required: true },
    targetLeader: { type: String, required: true },
    desiredDate: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'rejected'],
      default: 'pending',
    },
    note: { type: String },
  },
  { timestamps: true }
);

export const CitizenReceptionModel = mongoose.model<ICitizenReception>('CitizenReception', CitizenReceptionSchema);
