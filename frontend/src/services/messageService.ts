import apiClient from './api';
import { IConversation, IMessage } from '../types/api';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from './mockData';

export const messageService = {
  async getConversations(): Promise<IConversation[]> {
    try {
      const res = await apiClient.get('/messages/conversations');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('API getConversations failed, using fallback', e);
    }
    return MOCK_CONVERSATIONS;
  },

  async getMessages(conversationId: string): Promise<IMessage[]> {
    return MOCK_MESSAGES.filter(m => m.conversationId === conversationId);
  },

  async sendMessage(conversationId: string, content: string, senderName: string, senderRole: string): Promise<IMessage> {
    try {
      const res = await apiClient.post('/messages/send', { conversationId, content });
      if (res.data?.data) return res.data.data;
    } catch (e) {
      console.warn('API sendMessage failed, using local mock', e);
    }
    const newMsg: IMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'current-user',
      senderName,
      senderRole,
      content,
      createdAt: new Date().toISOString()
    };
    MOCK_MESSAGES.push(newMsg);
    const conv = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = content;
      conv.lastMessageTime = 'Vừa xong';
    }
    return newMsg;
  }
};
