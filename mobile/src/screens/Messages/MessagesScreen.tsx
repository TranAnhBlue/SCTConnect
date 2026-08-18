import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';

interface ChatMessage {
  id: string;
  sender: 'citizen' | 'officer';
  senderName: string;
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'citizen',
    senderName: 'Trần Anh',
    text: 'Kính chào Ban Thường trực Ủy ban MTTQ Xã! Tôi muốn hỏi về thủ tục đăng ký tham gia Tổ công tác Mặt trận và Tổ hòa giải cơ sở tại Thôn 2 cần chuẩn bị giấy tờ gì ạ?',
    time: '09:15',
  },
  {
    id: 'm2',
    sender: 'officer',
    senderName: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
    text: 'Chào bác Trần Anh! Thường trực Mặt trận Xã rất hoan nghênh tinh thần trách nhiệm của bác. Bác có thể nộp đơn trực tiếp trên ứng dụng SCTConnect hoặc gửi qua Trưởng Ban công tác Mặt trận Thôn 2 để Ủy ban MTTQ Xã ra quyết định kiện toàn nhé!',
    time: '09:30',
  },
  {
    id: 'm3',
    sender: 'citizen',
    senderName: 'Trần Anh',
    text: 'Dạ vâng, tôi đã nộp phiếu đăng ký trên ứng dụng rồi ạ. Cảm ơn đồng chí Chủ tịch!',
    time: '09:35',
  },
  {
    id: 'm4',
    sender: 'officer',
    senderName: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
    text: 'Thường trực đã tiếp nhận và sẽ có văn bản gửi bác trong tuần này. Chúc bác và gia đình sức khỏe!',
    time: '09:40',
  },
];

const HOTLINES = [
  { name: 'Thường trực Ủy ban MTTQ Xã', phone: '024.3386.1022', icon: 'shield-account', color: '#B71C1C' },
  { name: 'Đoàn Thanh niên & Tổ Chuyển đổi số', phone: '024.3386.1023', icon: 'flag-variant', color: '#1565C0' },
  { name: 'Tổ Tự quản ANTT Hội Cựu chiến binh', phone: '024.3386.1024', icon: 'medal', color: '#2E7D32' },
  { name: 'Tư vấn Vay vốn Hội Nông dân & Phụ nữ', phone: '024.3386.1025', icon: 'cash-multiple', color: '#E65100' },
];

export const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: user?.role && user.role !== 'citizen' ? 'officer' : 'citizen',
      senderName: user?.fullName || 'Trần Anh',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate Officer Auto-acknowledgement if citizen sent
    if (!user?.role || user.role === 'citizen') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          sender: 'officer',
          senderName: 'Cán bộ Thường trực Mặt trận Xã',
          text: 'Thường trực Ủy ban MTTQ Xã đã nhận được tin nhắn của bác và sẽ phản hồi chi tiết trong thời gian sớm nhất.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, reply]);
      }, 1200);
    }
  };

  const handleCallHotline = (phone: string) => {
    Alert.alert('Đường dây nóng Trực ban MTTQ', `Bạn có muốn gọi đến số điện thoại: ${phone}?`, [
      { text: 'Gọi ngay', onPress: () => Alert.alert('Đang kết nối...', `Đang gọi đến số ${phone}`) },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <MaterialCommunityIcons name="shield-account" size={24} color="#B71C1C" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Hộp thư Tiếp Dân Trực tuyến</Text>
            <Text style={styles.headerSub}>Thường trực Ủy ban MTTQ Xã Thanh Oai</Text>
          </View>
        </View>
      </View>

      {!isAuthenticated ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="lock-outline" size={64} color={Colors.border} />
          <Text style={styles.title}>🔒 Yêu cầu Đăng nhập</Text>
          <Text style={styles.sub}>
            Vui lòng đăng nhập tài khoản Công dân hoặc Cán bộ để trao đổi thông tin trực tiếp với Thường trực Ủy ban Mặt trận Tổ quốc Xã.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Đăng nhập Ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Quick Hotline Bar */}
          <View style={styles.hotlineSection}>
            <Text style={styles.hotlineSectionTitle}>📞 Đường dây nóng Tiếp dân & Đoàn thể:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hotlineScroll}>
              {HOTLINES.map((h, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.hotlineChip}
                  onPress={() => handleCallHotline(h.phone)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name={h.icon as any} size={16} color={h.color} />
                  <View>
                    <Text style={styles.hotlineChipName} numberOfLines={1}>{h.name}</Text>
                    <Text style={[styles.hotlineChipPhone, { color: h.color }]}>{h.phone}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Messages Body */}
          <ScrollView
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => {
              const isMe =
                (user?.role && user.role !== 'citizen' && m.sender === 'officer') ||
                ((!user?.role || user.role === 'citizen') && m.sender === 'citizen');

              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageWrapper,
                    isMe ? styles.messageWrapperRight : styles.messageWrapperLeft,
                  ]}
                >
                  <Text style={styles.senderHeader}>{m.senderName}</Text>
                  <View
                    style={[
                      styles.messageBubble,
                      isMe ? styles.bubbleRight : styles.bubbleLeft,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMe ? styles.textRight : styles.textLeft,
                      ]}
                    >
                      {m.text}
                    </Text>
                    <Text style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}>
                      {m.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn trao đổi với Thường trực Mặt trận..."
              placeholderTextColor={Colors.textHint}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSize.base, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)' },

  hotlineSection: {
    backgroundColor: '#FFF',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 4,
  },
  hotlineSectionTitle: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  hotlineScroll: { gap: 8, paddingVertical: 4 },
  hotlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hotlineChipName: { fontSize: 10, fontWeight: '700', color: Colors.textPrimary },
  hotlineChipPhone: { fontSize: 10, fontWeight: '800' },

  chatScroll: { flex: 1 },
  chatContent: { padding: Spacing.base, gap: Spacing.md, paddingBottom: 20 },

  messageWrapper: { maxWidth: '85%', gap: 2 },
  messageWrapperLeft: { alignSelf: 'flex-start' },
  messageWrapperRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  senderHeader: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, marginHorizontal: 4 },

  messageBubble: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  bubbleLeft: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleRight: {
    backgroundColor: '#B71C1C',
    borderTopRightRadius: 2,
  },
  messageText: { fontSize: FontSize.sm, lineHeight: 20 },
  textLeft: { color: Colors.textPrimary },
  textRight: { color: '#FFFFFF' },
  timeText: { fontSize: 9, marginTop: 4, textAlign: 'right' },
  timeLeft: { color: Colors.textHint },
  timeRight: { color: 'rgba(255,255,255,0.75)' },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: FontSize.sm,
    maxHeight: 90,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#B71C1C',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: 32 },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  sub: { fontSize: FontSize.xs, color: Colors.textHint, textAlign: 'center', lineHeight: 18 },
  loginBtn: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginTop: 12,
  },
  loginBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
});
