import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface CommunityPoll {
  id: string;
  author: string;
  roleTitle: string;
  timeAgo: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
}

const INITIAL_POLLS: CommunityPoll[] = [
  {
    id: 'poll_1',
    author: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
    roleTitle: 'Chủ tịch MTTQ Xã chỉ đạo',
    timeAgo: '2 giờ trước',
    title: 'Lấy ý kiến Nhân dân: Phương án nâng cấp tuyến đường liên thôn 2026',
    description: 'Kính mời bà con nhân dân và đoàn viên hội viên biểu quyết phương án thi công tuyến đường liên thôn 3.',
    totalVotes: 239,
    options: [
      { id: 'opt_1', text: 'Phương án 1: Mở rộng 6m và bê tông hóa (Quý 3/2026)', votes: 142 },
      { id: 'opt_2', text: 'Phương án 2: Rải thảm nhựa đường và hệ thống chiếu sáng (Quý 4/2026)', votes: 85 },
      { id: 'opt_3', text: 'Ý kiến đóng góp bổ sung khác', votes: 12 },
    ],
  },
  {
    id: 'poll_2',
    author: 'Đoàn TNCS Hồ Chí Minh Xã Thanh Oai',
    roleTitle: 'Khối MTTQ & Đoàn thể',
    timeAgo: '1 ngày trước',
    title: 'Biểu quyết: Địa điểm triển khai Đội Tình nguyện Chuyển đổi số & VNeID tuần tới',
    description: 'Thanh niên xung kích mở điểm hỗ trợ trực tiếp người cao tuổi cài đặt định danh điện tử.',
    totalVotes: 180,
    options: [
      { id: 'opt_2_1', text: 'Nhà Văn hóa Thôn Chiến Chiện (Thứ 7)', votes: 110 },
      { id: 'opt_2_2', text: 'Trụ sở Ủy ban Mặt trận Xã (Chủ nhật)', votes: 70 },
    ],
  },
];

export const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useAuthStore();
  const [polls, setPolls] = useState<CommunityPoll[]>(INITIAL_POLLS);
  const [votedOptions, setVotedOptions] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        '🔒 Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản Công dân / Đoàn viên để tham gia biểu quyết ý kiến cộng đồng.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }

    if (votedOptions[pollId]) {
      Alert.alert('Đã bình chọn', 'Bạn đã thực hiện biểu quyết cho nội dung này.');
      return;
    }

    setVotedOptions((prev) => ({ ...prev, [pollId]: optionId }));
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            totalVotes: poll.totalVotes + 1,
            options: poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          };
        }
        return poll;
      })
    );

    Alert.alert('Cảm ơn bạn!', 'Ý kiến biểu quyết của bạn đã được ghi nhận trực tiếp vào Hệ thống Mặt trận Xã.');
  };

  const handleCreateDiscussion = () => {
    if (!isAuthenticated) {
      Alert.alert(
        '🔒 Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập để mở chủ đề thảo luận dân chủ.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }

    Alert.alert('Mở chủ đề thảo luận', 'Tính năng tạo câu hỏi biểu quyết mới dành cho Mặt trận & Công dân.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biểu quyết & Thảo luận Dân chủ</Text>
        <Text style={styles.headerSub}>Mặt trận Tổ quốc Việt Nam Xã Thanh Oai</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Notice Banner */}
        <View style={styles.noticeBox}>
          <MaterialCommunityIcons name="bullhorn-outline" size={20} color="#D32F2F" />
          <Text style={styles.noticeText}>
            Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng. Kính mời bà con tham gia biểu quyết các chủ đề dưới đây.
          </Text>
        </View>

        {/* Poll List */}
        {polls.map((poll) => {
          const hasVoted = !!votedOptions[poll.id];
          return (
            <View key={poll.id} style={styles.pollCard}>
              <View style={styles.pollHeader}>
                <View style={styles.authorBadge}>
                  <MaterialCommunityIcons name="shield-check" size={18} color="#D32F2F" />
                  <Text style={styles.authorName}>{poll.author}</Text>
                </View>
                <Text style={styles.pollTime}>{poll.timeAgo}</Text>
              </View>

              <Text style={styles.pollTitle}>{poll.title}</Text>
              <Text style={styles.pollDesc}>{poll.description}</Text>

              {/* Options */}
              <View style={styles.optionsList}>
                {poll.options.map((opt) => {
                  const isSelected = votedOptions[poll.id] === opt.id;
                  const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.optBtn, isSelected && styles.optBtnSelected]}
                      onPress={() => handleVote(poll.id, opt.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.optTop}>
                        <Text style={[styles.optText, isSelected && styles.optTextSelected]}>{opt.text}</Text>
                        <Text style={styles.optPercent}>{percent}% ({opt.votes})</Text>
                      </View>

                      {/* Progress bar */}
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: isSelected ? '#2E7D32' : '#1565C0' }]} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.pollFooter}>
                <MaterialCommunityIcons name="account-group" size={16} color={Colors.textHint} />
                <Text style={styles.pollFooterText}>Tổng số lượt biểu quyết: {poll.totalVotes} công dân</Text>
                {hasVoted && (
                  <View style={styles.votedBadge}>
                    <MaterialCommunityIcons name="check-circle" size={14} color="#2E7D32" />
                    <Text style={styles.votedText}>Đã biểu quyết</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Floating Action Button to Create Discussion */}
      <TouchableOpacity style={styles.fabBtn} onPress={handleCreateDiscussion} activeOpacity={0.85}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        <Text style={styles.fabBtnText}>Tạo Biểu quyết mới</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.base, paddingBottom: 80 },

  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFEBEE',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  noticeText: { flex: 1, fontSize: FontSize.xs, color: '#B71C1C', fontWeight: '600', lineHeight: 18 },

  pollCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  pollHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  authorBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorName: { fontSize: FontSize.xs, fontWeight: '700', color: '#D32F2F' },
  pollTime: { fontSize: FontSize.xs, color: Colors.textHint },
  pollTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  pollDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },

  optionsList: { gap: Spacing.sm, marginTop: 4 },
  optBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optBtnSelected: { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' },
  optTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optText: { flex: 1, fontSize: FontSize.xs, color: Colors.textPrimary, fontWeight: '600' },
  optTextSelected: { color: '#2E7D32', fontWeight: '700' },
  optPercent: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '700' },
  progressBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },

  pollFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pollFooterText: { flex: 1, fontSize: FontSize.xs, color: Colors.textHint },
  votedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  votedText: { fontSize: 10, color: '#2E7D32', fontWeight: '700' },

  fabBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B71C1C',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: 6,
    ...Shadow.md,
  },
  fabBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
});
