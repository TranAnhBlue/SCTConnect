import mongoose, { Schema, Document } from 'mongoose';

export interface IPollOption {
  optionText: string;
  votesCount: number;
}

export interface IPost extends Document {
  authorName: string;
  authorAvatar?: string;
  authorRole: 'citizen' | 'officer' | 'ubnd';
  content: string;
  imageUrls?: string[];
  category: 'announcement' | 'discussion' | 'poll' | 'news';
  pollOptions?: IPollOption[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

const PollOptionSchema = new Schema<IPollOption>({
  optionText: { type: String, required: true },
  votesCount: { type: Number, default: 0 },
});

const PostSchema = new Schema<IPost>(
  {
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: 'https://picsum.photos/seed/author/200/200' },
    authorRole: { type: String, enum: ['citizen', 'officer', 'ubnd'], default: 'citizen' },
    content: { type: String, required: true },
    imageUrls: [{ type: String }],
    category: {
      type: String,
      enum: ['announcement', 'discussion', 'poll', 'news'],
      default: 'discussion',
    },
    pollOptions: [PollOptionSchema],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PostModel = mongoose.model<IPost>('Post', PostSchema);
