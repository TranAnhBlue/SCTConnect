import { Request, Response } from 'express';
import { PostModel } from '../models/Post';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query: any = {};
    if (category) query.category = category;

    const posts = await PostModel.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: posts.length, data: posts });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { authorName, authorRole, content, imageUrls, category, pollOptions } = req.body;

    const post = await PostModel.create({
      authorName: authorName || 'Người dân',
      authorRole: authorRole || 'citizen',
      content,
      imageUrls,
      category: category || 'discussion',
      pollOptions: pollOptions ? pollOptions.map((opt: string) => ({ optionText: opt, votesCount: 0 })) : undefined,
    });

    return res.status(201).json({ success: true, data: post });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findByIdAndUpdate(id, { $inc: { likesCount: 1 } }, { new: true });
    return res.json({ success: true, data: post });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const votePoll = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { optionIndex } = req.body;

    const post = await PostModel.findById(id);
    if (!post || !post.pollOptions || !post.pollOptions[optionIndex]) {
      return res.status(400).json({ success: false, message: 'Lựa chọn không hợp lệ' });
    }

    post.pollOptions[optionIndex].votesCount += 1;
    await post.save();

    return res.json({ success: true, message: 'Bình chọn thành công', data: post });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
