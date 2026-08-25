import React, { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { IConversation, IMessage } from '../types/api';
import {
  MessageSquare,
  Send,
  User,
  CheckCircle2,
  FileText,
  Search
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadConversations() {
      setLoading(true);
      try {
        const convList = await messageService.getConversations();
        setConversations(convList);
        if (convList.length > 0) {
          setSelectedConv(convList[0]);
          const msgList = await messageService.getMessages(convList[0].id);
          setMessages(msgList);
        }
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = async (conv: IConversation) => {
    setSelectedConv(conv);
    const msgList = await messageService.getMessages(conv.id);
    setMessages(msgList);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !selectedConv) return;

    const newMsg = await messageService.sendMessage(
      selectedConv.id,
      inputContent.trim(),
      user.fullName,
      user.titleName || 'Cán bộ'
    );
    setMessages(prev => [...prev, newMsg]);
    setInputContent('');
  };

  return (
    <div className="messages-page">
      <div className="page-header-row">
        <div>
          <h2>Hộp Thư Trao Đổi Cán Bộ - Người Dân</h2>
          <p className="page-sub">Kênh trao đổi thông tin trực tiếp phục vụ giải quyết phản ánh và hướng dẫn thủ tục</p>
        </div>
      </div>

      <div className="chat-layout-card">
        {/* Left: Conversations List */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Cuộc hội thoại ({conversations.length})</h3>
          </div>

          <div className="conversations-list">
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`conversation-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <img src={conv.participantAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt={conv.participantName} className="conv-avatar" />
                  <div className="conv-content">
                    <div className="conv-top">
                      <strong>{conv.participantName}</strong>
                      <small>{conv.lastMessageTime}</small>
                    </div>
                    <p className="conv-last-msg">{conv.lastMessage}</p>
                    {conv.relatedReportCode && (
                      <span className="conv-report-code">Mã: {conv.relatedReportCode}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="chat-main-window">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <img src={selectedConv.participantAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} alt={selectedConv.participantName} className="top-avatar" />
                <div>
                  <strong>{selectedConv.participantName}</strong>
                  <p>{selectedConv.participantRole}</p>
                </div>
              </div>

              {/* Messages Body */}
              <div className="chat-messages-container">
                {messages.map((m, i) => {
                  const isMe = m.senderId === 'current-user' || m.senderName === user.fullName;
                  return (
                    <div key={i} className={`chat-bubble-wrap ${isMe ? 'outgoing' : 'incoming'}`}>
                      {!isMe && <div className="bubble-sender">{m.senderName} ({m.senderRole})</div>}
                      <div className="chat-bubble">
                        <p>{m.content}</p>
                        <span className="bubble-time">{new Date(m.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Nhập nội dung tin nhắn trao đổi..."
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                />
                <button type="submit" className="cta-btn sm">
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <p>Chọn một cuộc hội thoại để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
