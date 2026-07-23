import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  iconName: string;
  category: 'public' | 'hotline' | 'map' | 'procedure';
  hotline?: string;
  screenRoute?: string;
  isHot: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true },
    category: {
      type: String,
      enum: ['public', 'hotline', 'map', 'procedure'],
      default: 'public',
    },
    hotline: { type: String },
    screenRoute: { type: String },
    isHot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.model<IService>('Service', ServiceSchema);
