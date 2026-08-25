import React, { useState, useEffect } from 'react';
import { communityService } from '../services/communityService';
import { useAuth } from '../context/AuthContext';
import { IPost } from '../types/api';
import {
  Heart,
  MessageSquare,
  BarChart2,
  PlusCircle,
  Pin,
  CheckCircle2,
  Users,
  Send,
  Sparkles
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Post Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'announcement' | 'discussion' | 'poll'>('poll');
  const [pollOptions, setPollOptions] = useState<string[]>(['Phương án A', 'Phương án B']);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await communityService.getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    const updated = await communityService.likePost(postId);
    setPosts(prev => prev.map(p => p.id === postId ? updated : p));
  };

  const handleVote = async (postId: string, optionId: string) => {
    const updated = await communityService.votePoll(postId, optionId);
    setPosts(prev => prev.map(p => p.id === postId ? updated : p));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await communityService.createPost({
      title,
      content,
      postType,
      authorName: user.fullName,
      authorRole: user.titleName || 'Cán bộ',
      authorAvatar: user.avatarUrl,
      organization: user.organization || 'mttq',
      pollOptions: postType === 'poll' ? pollOptions.filter(o => o.trim()).map((opt, i) => ({
        id: `opt-${Date.now()}-${i}`,
        optionText: opt,
        votes: 0
      })) : undefined
    });

    setTitle('');
    setContent('');
    setShowCreateModal(false);
    loadPosts();
  };

  return (
    <div className="community-page">
      <div className="page-header-row">
        <div>
          <h2>Diễn Đàn Cộng Đồng &amp; Khảo Sát Ý Kiến Dân</h2>
          <p className="page-sub">Nơi nhân dân và các tổ chức đoàn thể cùng thảo luận, biểu quyết các chủ trương cơ sở</p>
        </div>
        <button type="button" className="cta-btn" onClick={() => setShowCreateModal(true)}>
          <PlusCircle size={16} />
          <span>Tạo khảo sát / bài viết</span>
        </button>
      </div>

      {/* Posts Feed */}
      <div className="community-feed">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải bảng tin cộng đồng...</p>
          </div>
        ) : (
          posts.map((post) => {
            const totalVotes = post.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 0;

            return (
              <div key={post.id} className={`post-card ${post.isPinned ? 'pinned' : ''}`}>
                {post.isPinned && (
                  <div className="pinned-badge">
                    <Pin size={13} />
                    <span>Ghim đầu bảng tin thông báo</span>
                  </div>
                )}

                <div className="post-header">
                  <img src={post.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt={post.authorName} className="post-avatar" />
                  <div className="post-author-meta">
                    <strong>{post.authorName}</strong>
                    <span className="post-author-role">{post.authorRole}</span>
                    <small>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</small>
                  </div>
                </div>

                <div className="post-body">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>

                  {/* Poll voting UI */}
                  {post.postType === 'poll' && post.pollOptions && (
                    <div className="poll-container">
                      <div className="poll-header">
                        <BarChart2 size={16} className="text-gold" />
                        <strong>Khảo sát biểu quyết ý kiến ({totalVotes} lượt đã bình chọn)</strong>
                      </div>

                      <div className="poll-options-list">
                        {post.pollOptions.map((opt) => {
                          const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          const isVoted = post.userVotedOptionId === opt.id;

                          return (
                            <div
                              key={opt.id}
                              className={`poll-option-item ${isVoted ? 'voted' : ''}`}
                              onClick={() => handleVote(post.id, opt.id)}
                            >
                              <div className="poll-option-bg" style={{ width: `${percent}%` }} />
                              <div className="poll-option-content">
                                <div className="option-text-wrap">
                                  <span className="radio-circle">{isVoted ? '●' : '○'}</span>
                                  <span>{opt.optionText}</span>
                                </div>
                                <strong className="option-percent">{percent}% ({opt.votes})</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {post.images && post.images.length > 0 && (
                    <div className="post-images">
                      {post.images.map((img, i) => (
                        <img key={i} src={img} alt="Ảnh đính kèm" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="post-footer">
                  <button
                    type="button"
                    className={`post-action-btn ${post.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} fill={post.liked ? '#D3251F' : 'none'} color={post.liked ? '#D3251F' : 'currentColor'} />
                    <span>{post.likes} Yêu thích</span>
                  </button>

                  <div className="post-action-btn">
                    <MessageSquare size={18} />
                    <span>{post.commentsCount} Bình luận</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="modal-overlay open" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            <h3>Tạo bài viết hoặc Khảo sát ý kiến mới</h3>
            <p className="modal-sub">Đăng tải lên bảng tin Mặt trận và các tổ chức đoàn thể cơ sở</p>

            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Loại bài đăng</label>
                <select value={postType} onChange={(e: any) => setPostType(e.target.value)}>
                  <option value="poll">Khảo sát lấy ý kiến nhân dân (Poll)</option>
                  <option value="announcement">Thông báo chính thức của đoàn thể</option>
                  <option value="discussion">Chủ đề thảo luận cộng đồng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tiêu đề *</label>
                <input
                  type="text"
                  required
                  placeholder="Tiêu đề bài đăng hoặc câu hỏi khảo sát..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Nội dung chi tiết *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả nội dung cụ thể..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {postType === 'poll' && (
                <div className="form-group">
                  <label>Các phương án bình chọn</label>
                  {pollOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      style={{ marginBottom: 6 }}
                      value={opt}
                      onChange={(e) => {
                        const next = [...pollOptions];
                        next[idx] = e.target.value;
                        setPollOptions(next);
                      }}
                      placeholder={`Phương án ${idx + 1}`}
                    />
                  ))}
                  <button
                    type="button"
                    className="cta-ghost"
                    style={{ marginTop: 6 }}
                    onClick={() => setPollOptions(prev => [...prev, `Phương án ${prev.length + 1}`])}
                  >
                    + Thêm phương án bình chọn
                  </button>
                </div>
              )}

              <div className="form-action-buttons">
                <button type="button" className="cta-ghost" onClick={() => setShowCreateModal(false)}>Hủy</button>
                <button type="submit" className="cta-btn">Đăng bài ngay</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
