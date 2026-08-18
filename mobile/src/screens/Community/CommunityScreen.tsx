import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    id: 'p1',
    author: 'Ủy ban MTTQ Việt Nam Xã Thanh Oai',
    roleTitle: 'Cơ quan Thường trực MTTQ Xã',
    timeAgo: 'Hôm nay',
    title: 'Lấy ý kiến biểu quyết: Phương án Lắp đặt Hệ thống Camera An ninh & Chiếu sáng Năng lượng Mặt trời',
    description: 'Thực hiện phương châm "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng", Ủy ban MTTQ xã lấy ý kiến biểu quyết của toàn thể bà con về phương án triển khai tại các trục đường liên thôn:',
    options: [
      { id: 'opt_1', text: 'Phương án 1: Xã hội hóa 50% ngân sách xã hỗ trợ, 50% nhân dân đóng góp', votes: 236 },
      { id: 'opt_2', text: 'Phương án 2: Ưu tiên hoàn thành hệ thống Đèn năng lượng mặt trời trước (Quý 3)', votes: 168 },
      { id: 'opt_3', text: 'Phương án 3: Triển khai theo từng ngõ xóm tự quản, cụm dân cư tự chủ', votes: 94 },
    ],
    totalVotes: 498,
  },
  {
    id: 'p2',
    author: 'Đoàn TNCS Hồ Chí Minh Xã Thanh Oai',
    roleTitle: 'Ban Thường vụ Đoàn Xã',
    timeAgo: '1 ngày trước',
    title: 'Bình chọn: Tuyến đường Hoa Thanh niên & Bức tranh Bích họa Làng quê 2026',
    description: 'Đoàn Thanh niên xã phối hợp Hội Phụ nữ tổ chức đợt ra quân chỉnh trang cảnh quan. Kính mời bà con nhân dân bình chọn khu vực ưu tiên làm đẹp đợt 1:',
    options: [
      { id: 'opt_4', text: 'Tuyến đường từ Cổng chào vào Nhà Văn hóa Thôn Chiến Chiện', votes: 185 },
      { id: 'opt_5', text: 'Tuyến đê bao quanh Trường Tiểu học & Trạm Y tế Xã', votes: 142 },
      { id: 'opt_6', text: 'Khu vực bến sông và đường hoa ven kênh Thôn Bình Minh', votes: 110 },
    ],
    totalVotes: 437,
  },
  {
    id: 'p3',
    author: 'Hội Nông dân Xã Thanh Oai',
    roleTitle: 'Ban Chấp hành Hội Nông dân',
    timeAgo: '2 ngày trước',
    title: 'Khảo sát: Nhu cầu vay vốn ưu đãi đầu tư Máy gặt & Hệ thống sấy lúa vụ Thu Đông',
    description: 'Hội Nông dân xã tổng hợp nhu cầu của các tổ hội nông nghiệp để đề xuất Hội đồng quản lý Quỹ Hỗ trợ Nông dân huyện phân bổ nguồn vốn:',
    options: [
      { id: 'opt_7', text: 'Nhu cầu vay từ 50 - 100 triệu đồng (Cá nhân/hộ kinh doanh)', votes: 156 },
      { id: 'opt_8', text: 'Nhu cầu vay từ 300 - 500 triệu đồng (Tổ hợp tác/Hợp tác xã)', votes: 78 },
      { id: 'opt_9', text: 'Chưa có nhu cầu vay vốn trong đợt này', votes: 45 },
    ],
    totalVotes: 279,
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
      Alert.alert('Đã biểu quyết', 'Bạn đã thực hiện biểu quyết cho nội dung này.');
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

    Alert.alert('Cảm ơn bạn! 🎉', 'Ý kiến biểu quyết của bạn đã được ghi nhận trực tiếp vào Hệ thống Cơ sở dữ liệu Mặt trận Xã.');
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

    Alert.alert('Mở chủ đề thảo luận', 'Bạn có thể gửi câu hỏi hoặc đề xuất ý kiến trực tiếp tới Ban Thường trực Ủy ban Mặt trận Xã qua tính năng Gửi phản ánh & Kiến nghị.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biểu quyết & Thảo luận Dân chủ</Text>
        <Text style={styles.headerSub}>Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai</Text>
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
                        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: isSelected ? '#2E7D32' : '#B71C1C' }]} />
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
        <MaterialCommunityIcons name="plus" size={22} color="#FFF" />
        <Text style={styles.fabBtnText}>Gửi Ý kiến Biểu quyết</Text>
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
  authorBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
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
  optText: { flex: 1, fontSize: FontSize.xs, color: Colors.textPrimary, fontWeight: '600', paddingRight: 8 },
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
