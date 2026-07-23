import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  role: 'citizen' | 'officer' | 'admin';
  department?: string;
  commune: string;
  district: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    passwordHash: { type: String },
    role: { type: String, enum: ['citizen', 'officer', 'admin'], default: 'citizen' },
    department: { type: String },
    commune: { type: String, default: 'UBND Xã Thanh Oai' },
    district: { type: String, default: 'Huyện Thanh Oai' },
    avatarUrl: { type: String, default: 'https://picsum.photos/seed/user_avatar/200/200' },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
