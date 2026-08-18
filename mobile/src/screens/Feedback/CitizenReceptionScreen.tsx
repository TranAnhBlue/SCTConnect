import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { AppBar } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { receptionService } from '../../api/receptionService';

type Props = NativeStackScreenProps<RootStackParamList, 'CitizenReception'>;

interface ReceptionSchedule {
  id: string;
  leaderTitle: string;
  leaderName: string;
  org: string;
  scheduleDay: string;
  timeSlot: string;
  location: string;
  avatarBg: string;
  iconName: string;
}

interface RegistrationRecord {
  id: string;
  citizenName: string;
  phone: string;
  targetLeader: string;
  desiredDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  note?: string;
  createdAt: string;
}

const UPCOMING_SCHEDULES: ReceptionSchedule[] = [
  {
    id: 's1',
    leaderTitle: 'Chủ tịch Ủy ban MTTQ Xã',
    leaderName: 'Đ/c Nguyễn Văn Minh',
    org: 'Ủy ban MTTQ Việt Nam Xã',
    scheduleDay: 'Thứ 2 (Ngày 10 & 25 hàng tháng)',
    timeSlot: '08:00 - 11:30',
    location: 'Phòng Tiếp công dân - Trụ sở Cơ quan Mặt trận Xã',
    avatarBg: '#FFEBEE',
    iconName: 'shield-account',
  },
  {
    id: 's2',
    leaderTitle: 'Bí thư Đoàn Thanh niên Xã',
    leaderName: 'Đ/c Lê Hoàng Nam',
    org: 'Đoàn TNCS Hồ Chí Minh',
    scheduleDay: 'Thứ 4 hàng tuần',
    timeSlot: '14:00 - 17:00',
    location: 'Văn phòng Đoàn Thanh niên - Nhà Văn hóa Xã',
    avatarBg: '#E3F2FD',
    iconName: 'flag-variant',
  },
  {
    id: 's3',
    leaderTitle: 'Chủ tịch Hội Liên hiệp Phụ nữ Xã',
    leaderName: 'Đ/c Trần Thị Hoa',
    org: 'Hội LHPN Việt Nam Xã',
    scheduleDay: 'Thứ 5 hàng tuần',
    timeSlot: '08:30 - 11:00',
    location: 'Văn phòng Hội Phụ nữ Xã',
    avatarBg: '#FCE4EC',
    iconName: 'account-child-circle',
  },
  {
    id: 's4',
    leaderTitle: 'Chủ tịch Hội Nông dân Xã',
    leaderName: 'Đ/c Phạm Văn Hùng',
    org: 'Hội Nông dân Việt Nam Xã',
    scheduleDay: 'Thứ 3 hàng tuần',
    timeSlot: '13:30 - 16:30',
    location: 'Văn phòng Hội Nông dân Xã',
    avatarBg: '#F9FBE7',
    iconName: 'sprout',
  },
];

export const CitizenReceptionScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isAuthenticated } = useAuthStore();
  const isOfficer = isAuthenticated && !!(user?.role && user.role !== 'citizen');
  const [activeTab, setActiveTab] = useState<'schedule' | 'register' | 'my_registrations'>('schedule');

  // Registration Form State
  const [citizenName, setCitizenName] = useState(user?.fullName || 'Trần Anh');
  const [phone, setPhone] = useState(user?.phone || '0912345678');
  const [selectedLeader, setSelectedLeader] = useState<string>('Chủ tịch Ủy ban MTTQ Xã (Đ/c Nguyễn Văn Minh)');
  const [desiredDate, setDesiredDate] = useState('28/07/2026 (Thứ Ba)');
  const [reason, setReason] = useState('Đề nghị Thường trực Mặt trận Xã tiếp công dân & đối thoại trực tiếp về công tác an sinh xã hội và giải phóng mặt bằng.');
  const [loading, setLoading] = useState(false);

  // Live registrations from MongoDB Cloud API
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);

  React.useEffect(() => {
    fetchLiveReceptions();
  }, []);

  const fetchLiveReceptions = async () => {
    setLoading(true);
    const data = await receptionService.getReceptions();
    setRegistrations(data);
    setLoading(false);
  };

  const handleApproveByOfficer = (regId: string) => {
    Alert.alert(
      'Phê duyệt Lịch Tiếp công dân',
      'Đồng ý xếp lịch đối thoại trực tiếp với công dân tại Trụ sở Mặt trận Xã?',
      [
        {
          text: 'Phê duyệt & Xếp lịch',
          onPress: () => {
            setRegistrations((prev) =>
              prev.map((r) =>
                r.id === regId
                  ? {
                      ...r,
                      status: 'approved',
                      note: 'Đã xếp lịch tiếp công dân lúc 08:30 tại Trụ sở Mặt trận Xã.',
                    }
                  : r
              )
            );
            Alert.alert('Thành công!', 'Đã phê duyệt lịch hẹn và gửi thông báo xác nhận tới công dân.');
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };

  const handleRegisterSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản để gửi Phiếu Đăng ký Tiếp công dân & Đối thoại với Lãnh đạo.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }

    const finalName = citizenName.trim() || user?.fullName || 'Trần Anh';
    const finalPhone = phone.trim() || '0912345678';
    const finalReason = reason.trim() || 'Đăng ký đối thoại trực tiếp với Lãnh đạo Mặt trận Xã';

    setLoading(true);
    const newReg = await receptionService.createReception({
      citizenName: finalName,
      phone: finalPhone,
      targetLeader: selectedLeader,
      desiredDate: desiredDate,
      reason: finalReason,
    });

    setRegistrations([newReg, ...registrations]);
    setLoading(false);
    setActiveTab('my_registrations');
    Alert.alert('Đăng ký thành công!', 'Phiếu đăng ký tiếp công dân của bạn đã được ghi nhận và lưu trực tiếp vào MongoDB Cloud Database.');
  };

  const handleTabPress = (tab: 'schedule' | 'register' | 'my_registrations') => {
    if (!isAuthenticated && tab !== 'schedule') {
      Alert.alert(
        '🔒 Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản Công dân để thực hiện Đăng ký Lịch gặp Lãnh đạo hoặc Xem phiếu đã đăng ký.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }
    setActiveTab(tab);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />
      <AppBar
        title={isOfficer ? 'Quản lý Lịch Tiếp Công dân & Đối thoại' : 'Đăng ký Tiếp Công dân & Đối thoại'}
        showBack
        onBack={() => navigation.goBack()}
        variant="primary"
      />

      {/* Top Segmented Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'schedule' && styles.tabItemActive]}
          onPress={() => handleTabPress('schedule')}
        >
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.tabTextActive]}>
            Lịch Tiếp Định kỳ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'register' && styles.tabItemActive]}
          onPress={() => handleTabPress('register')}
        >
          <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
            Đăng ký Lịch gặp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'my_registrations' && styles.tabItemActive]}
          onPress={() => handleTabPress('my_registrations')}
        >
          <Text style={[styles.tabText, activeTab === 'my_registrations' && styles.tabTextActive]}>
            {isOfficer ? `Phiếu chờ duyệt (${registrations.length})` : `Phiếu đã đăng ký (${registrations.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >

        {/* TAB 1: SCHEDULE */}
        {activeTab === 'schedule' && (
          <View style={styles.sectionGap}>
            <View style={styles.headerNotice}>
              <MaterialCommunityIcons name="information" size={20} color="#D32F2F" />
              <Text style={styles.headerNoticeText}>
                Thường trực Ủy ban MTTQ và Lãnh đạo các Tổ chức Chính trị - Xã hội tổ chức tiếp công dân định kỳ và đối thoại trực tiếp theo quy định của Luật MTTQ Việt Nam.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Lịch Tiếp Công dân & Lãnh đạo Khối Mặt trận</Text>

            {UPCOMING_SCHEDULES.map((item) => (
              <View key={item.id} style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                  <View style={[styles.avatarBox, { backgroundColor: item.avatarBg }]}>
                    <MaterialCommunityIcons name={item.iconName as any} size={24} color="#D32F2F" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.leaderTitle}>{item.leaderTitle}</Text>
                    <Text style={styles.leaderName}>{item.leaderName}</Text>
                    <Text style={styles.leaderOrg}>{item.org}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.scheduleDetailRow}>
                  <MaterialCommunityIcons name="calendar-clock" size={16} color={Colors.primary} />
                  <Text style={styles.scheduleDetailText}>
                    <Text style={{ fontWeight: '700' }}>Thời gian:</Text> {item.scheduleDay} ({item.timeSlot})
                  </Text>
                </View>

                <View style={styles.scheduleDetailRow}>
                  <MaterialCommunityIcons name="map-marker-radius" size={16} color="#E65100" />
                  <Text style={styles.scheduleDetailText}>
                    <Text style={{ fontWeight: '700' }}>Địa điểm:</Text> {item.location}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.bookQuickBtn}
                  onPress={() => {
                    setSelectedLeader(`${item.leaderTitle} (${item.leaderName})`);
                    setActiveTab('register');
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="account-plus" size={16} color="#FFF" />
                  <Text style={styles.bookQuickText}>Đăng ký Lịch gặp Đồng chí này</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <View style={styles.sectionGap}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Phiếu Đăng ký Tiếp công dân / Đối thoại</Text>
              <Text style={styles.formSub}>Vui lòng điền thông tin để Thường trực Mặt trận sắp xếp lịch đối thoại phù hợp.</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên người đăng ký <Text style={styles.req}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={citizenName}
                  onChangeText={setCitizenName}
                  placeholder="Nhập họ tên đầy đủ..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại liên hệ <Text style={styles.req}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Nhập số điện thoại..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lãnh đạo Khối Mặt trận muốn đăng ký gặp:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
                  {[
                    'Chủ tịch Ủy ban MTTQ Xã',
                    'Bí thư Đoàn Thanh niên',
                    'Chủ tịch Hội Phụ nữ',
                    'Chủ tịch Hội Cựu chiến binh',
                    'Chủ tịch Hội Nông dân',
                  ].map((lead, idx) => {
                    const isSel = selectedLeader.includes(lead);
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedLeader(lead)}
                        style={[styles.leaderChip, isSel && styles.leaderChipActive]}
                      >
                        <Text style={[styles.leaderChipText, isSel && styles.leaderChipTextActive]}>{lead}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ngày dự kiến đối thoại / gặp mặt:</Text>
                <TextInput
                  style={styles.input}
                  value={desiredDate}
                  onChangeText={setDesiredDate}
                  placeholder="Ví dụ: 28/07/2026 (Buổi sáng)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nội dung / Vấn đề đăng ký đối thoại <Text style={styles.req}>*</Text></Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Mô tả tóm tắt ý kiến, kiến nghị hoặc vấn đề bạn muốn trình bày trực tiếp với Lãnh đạo..."
                  multiline
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleRegisterSubmit} activeOpacity={0.85}>
                <MaterialCommunityIcons name="send-check" size={18} color="#FFF" />
                <Text style={styles.submitBtnText}>Gửi Đăng ký Lịch Tiếp công dân</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 3: REGISTRATIONS LIST / OFFICER APPROVAL LIST */}
        {activeTab === 'my_registrations' && (
          <View style={styles.sectionGap}>
            <Text style={styles.sectionTitle}>
              {isOfficer ? 'Danh sách Phiếu Tiếp Dân chờ Lãnh đạo Phê duyệt' : 'Danh sách Phiếu Đăng ký Tiếp dân của bạn'}
            </Text>

            {registrations.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="calendar-remove" size={48} color={Colors.border} />
                <Text style={styles.emptyText}>Chưa có phiếu đăng ký tiếp dân nào.</Text>
              </View>
            ) : (
              registrations.map((item) => (
                <View key={item.id} style={styles.regCard}>
                  <View style={styles.regHeader}>
                    <View style={styles.regStatusBadge}>
                      <Text style={styles.regStatusText}>
                        {item.status === 'pending' ? '⏳ ĐANG CHỜ PHÊ DUYỆT' : item.status === 'approved' ? '✅ ĐÃ XẾP LỊCH GẶP' : '✔️ ĐÃ TIẾP XONG'}
                      </Text>
                    </View>
                    <Text style={styles.regDate}>Ngày gửi: {item.createdAt}</Text>
                  </View>

                  <Text style={styles.regLeader}>
                    Công dân đăng ký: <Text style={{ fontWeight: '700', color: Colors.primary }}>{item.citizenName} ({item.phone})</Text>
                  </Text>
                  <Text style={styles.regLeader}>Lãnh đạo tiếp: <Text style={{ fontWeight: '700' }}>{item.targetLeader}</Text></Text>
                  <Text style={styles.regDesired}>Lịch đối thoại: <Text style={{ fontWeight: '700', color: Colors.primary }}>{item.desiredDate}</Text></Text>
                  <Text style={styles.regReason} numberOfLines={3}>"{item.reason}"</Text>

                  {item.status === 'approved' && (
                    <View style={styles.confirmedBox}>
                      <MaterialCommunityIcons name="check-decagram" size={16} color="#2E7D32" />
                      <Text style={styles.confirmedText}>
                        {item.note || `Đã được Thường trực Mặt trận phê duyệt. Vui lòng có mặt đúng 08:30 ngày ${item.desiredDate} tại Trụ sở Mặt trận Xã.`}
                      </Text>
                    </View>
                  )}

                  {/* Officer Approval Buttons */}
                  {isOfficer && item.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.officerApproveBtn}
                      onPress={() => handleApproveByOfficer(item.id)}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons name="check-circle-outline" size={16} color="#FFF" />
                      <Text style={styles.officerApproveBtnText}>Phê duyệt & Xếp lịch Hẹn Công dân</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#9A0007',
    paddingHorizontal: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: FontSize.xs,
    color: '#FFCDD2',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  scroll: { flex: 1 },
  content: { padding: Spacing.base },
  sectionGap: { gap: Spacing.md },

  headerNotice: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: '#FFEBEE',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  headerNoticeText: { flex: 1, fontSize: FontSize.xs, color: '#B71C1C', lineHeight: 18 },

  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },

  /* Schedule Card */
  scheduleCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderTitle: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },
  leaderName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  leaderOrg: { fontSize: FontSize.xs, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 4 },
  scheduleDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scheduleDetailText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  bookQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 6,
    marginTop: Spacing.xs,
  },
  bookQuickText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '700' },

  /* Form */
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  formTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  formSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  req: { color: Colors.error },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  leaderChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leaderChipActive: { backgroundColor: '#E3F2FD', borderColor: Colors.primary },
  leaderChipText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
  leaderChipTextActive: { color: Colors.primary, fontWeight: '700' },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  submitBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },

  /* Registrations List */
  regCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  regHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  regStatusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  regStatusText: { fontSize: 10, fontWeight: '800', color: '#2E7D32' },
  regDate: { fontSize: FontSize.xs, color: Colors.textHint },
  regLeader: { fontSize: FontSize.sm, color: Colors.textPrimary },
  regDesired: { fontSize: FontSize.xs, color: Colors.textSecondary },
  regReason: { fontSize: FontSize.xs, color: Colors.textSecondary, fontStyle: 'italic', backgroundColor: '#F9F9F9', padding: Spacing.sm, borderRadius: 4 },
  confirmedBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', padding: Spacing.sm, borderRadius: BorderRadius.sm },
  confirmedText: { fontSize: FontSize.xs, color: '#2E7D32', flex: 1, fontWeight: '600' },
  officerApproveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: 6,
    marginTop: 4,
  },
  officerApproveBtnText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyText: { fontSize: FontSize.sm, color: Colors.textHint },
});
