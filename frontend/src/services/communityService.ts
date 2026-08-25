import apiClient from './api';
import { IPost } from '../types/api';
import { MOCK_POSTS } from './mockData';

export const communityService = {
  async getPosts(): Promise<IPost[]> {
    try {
      const res = await apiClient.get('/posts');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getPosts failed, using fallback', e);
    }
    return MOCK_POSTS;
  },

  async createPost(payload: Partial<IPost>): Promise<IPost> {
    try {
      const res = await apiClient.post('/posts', payload);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API createPost failed, using local mock', e);
    }
    const newPost: IPost = {
      id: `post-${Date.now()}`,
      authorName: payload.authorName || 'Cán bộ MTTQ Xã',
      authorRole: payload.authorRole || 'Cán bộ',
      authorAvatar: payload.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      organization: payload.organization || 'mttq',
      title: payload.title || 'Thông báo mới',
      content: payload.content || '',
      images: payload.images || [],
      postType: payload.postType || 'announcement',
      pollOptions: payload.pollOptions || [],
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  },

  async likePost(id: string): Promise<IPost> {
    try {
      const res = await apiClient.post(`/posts/${id}/like`);
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API likePost failed for ${id}`, e);
    }
    const post = MOCK_POSTS.find(p => p.id === id || p._id === id);
    if (post) {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
      return { ...post };
    }
    return MOCK_POSTS[0];
  },

  async votePoll(postId: string, optionId: string): Promise<IPost> {
    try {
      const res = await apiClient.post(`/posts/${postId}/vote`, { optionId });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn(`API votePoll failed for ${postId}`, e);
    }
    const post = MOCK_POSTS.find(p => p.id === postId || p._id === postId);
    if (post && post.pollOptions) {
      post.userVotedOptionId = optionId;
      const opt = post.pollOptions.find(o => o.id === optionId);
      if (opt) opt.votes += 1;
      return { ...post };
    }
    return MOCK_POSTS[0];
  }
};
