import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useReportStore } from '../../store/reportStore';
import { useNotificationStore } from '../../store/notificationStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface RoleThemeConfig {
  roleTitle: string;
  badgeTitle: string;
  themeColor: string;
  lightBg: string;
  iconName: string;
  orgKey: string;
  specializedToolText: string;
  specializedToolIcon: string;
  specializedToolRoute: string;
  specialNoticeText: string;
}

const ROLE_CONFIGS: Record<string, RoleThemeConfig> = {
  mttq: {
    roleTitle: 'Chủ tịch Ủy ban MTTQ Xã',
    badgeTitle: 'MẶT TRẬN TỔ QUỐC XÃ',
    themeColor: '#B71C1C',
    lightBg: '#FFEBEE',
    iconName: 'shield-account',
    orgKey: 'all',
    specializedToolText: 'Duyệt Lịch Tiếp Dân',
    specializedToolIcon: 'account-clock-outline',
    specializedToolRoute: 'CitizenReception',
    specialNoticeText: 'Cơ quan Mặt trận Xã chỉ đạo chung, phối hợp công tác Giám sát, Phản biện Xã hội và An sinh.',
  },
  youth: {
    roleTitle: 'Bí thư Đoàn Thanh niên Xã',
    badgeTitle: 'ĐOÀN TNCS HỒ CHÍ MINH',
    themeColor: '#0D47A1',
    lightBg: '#E3F2FD',
    iconName: 'flag-variant-outline',
    orgKey: 'youth',
    specializedToolText: 'Tuyên truyền VNeID',
    specializedToolIcon: 'qrcode-scan',
    specializedToolRoute: 'CreateReport',
    specialNoticeText: 'Đội Thanh niên Tình nguyện phụ trách hỗ trợ Chuyển đổi số, VNeID và đợt ra quân Ngày Chủ nhật Xanh.',
  },
  women: {
    roleTitle: 'Chủ tịch Hội Phụ nữ Xã',
    badgeTitle: 'HỘI LIÊN HIỆP PHỤ NỮ',
    themeColor: '#C2185B',
    lightBg: '#FCE4EC',
    iconName: 'account-child-circle',
    orgKey: 'women',
    specializedToolText: 'Mô hình 5 Không 3 Sạch',
    specializedToolIcon: 'sparkles',
    specializedToolRoute: 'FieldReport',
    specialNoticeText: 'Hội Phụ nữ phụ trách các mô hình Phân loại rác tại nguồn, An sinh trẻ em và Gia đình 5 không 3 sạch.',
  },
  veterans: {
    roleTitle: 'Chủ tịch Hội Cựu chiến binh Xã',
    badgeTitle: 'HỘI CỰU CHIẾN BINH',
    themeColor: '#1B5E20',
    lightBg: '#E8F5E9',
    iconName: 'medal-outline',
    orgKey: 'veterans',
    specializedToolText: 'Tổ Tuần tra ANTT',
    specializedToolIcon: 'shield-home-outline',
    specializedToolRoute: 'FeedbackMap',
    specialNoticeText: 'Hội Cựu chiến binh duy trì Tổ Tuần tra Nhân dân giữ gìn trật tự công cộng và an ninh khu dân cư.',
  },
  farmers: {
    roleTitle: 'Chủ tịch Hội Nông dân Xã',
    badgeTitle: 'HỘI NÔNG DÂN VIỆT NAM',
    themeColor: '#E65100',
    lightBg: '#FFF3E0',
    iconName: 'sprout-outline',
    orgKey: 'farmers',
    specializedToolText: 'Vay vốn NHCSXH',
    specializedToolIcon: 'cash-register',
    specializedToolRoute: 'CitizenReception',
    specialNoticeText: 'Hội Nông dân hỗ trợ hội viên vay vốn tín dụng chính sách, vật tư nông nghiệp và máy móc sản xuất.',
  },
  union: {
    roleTitle: 'Chủ tịch Công đoàn Xã',
    badgeTitle: 'CÔNG ĐOÀN CƠ QUAN',
    themeColor: '#F57F17',
    lightBg: '#FFF8E1',
    iconName: 'briefcase-account-outline',
    orgKey: 'union',
    specializedToolText: 'Tư vấn Lao động',
    specializedToolIcon: 'file-certificate-outline',
    specializedToolRoute: 'FieldReport',
    specialNoticeText: 'Công đoàn cơ quan tư vấn bảo vệ quyền và lợi ích hợp pháp của công nhân, người lao động tại làng nghề.',
  },
};

export const OfficerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, isAuthenticated } = useAuthStore();
  const fieldReports = useReportStore((state) => state.fieldReports);
  const unreadCount = useNotificationStore((state) =>
    state.getUnreadCountForUser(user?.role, user?.organization, isAuthenticated)
  );

  // Determine specific role config
  const userOrgKey = user?.organization || (user?.role === 'youth_leader' ? 'youth' : user?.role === 'women_leader' ? 'women' : user?.role === 'veteran_leader' ? 'veterans' : user?.role === 'union_leader' ? 'union' : user?.role === 'farmer_leader' ? 'farmers' : 'mttq');
  const roleConfig = ROLE_CONFIGS[userOrgKey] || ROLE_CONFIGS.mttq;

  // Initial active org filter defaults to user's specific organization
  const [activeOrg, setActiveOrg] = React.useState<string>('all');

  const filteredReports = React.useMemo(() => {
    if (activeOrg === 'all') return fieldReports;
    return fieldReports.filter((r) => {
      const targetOrg = (r as any).targetOrganization;
      if (targetOrg && targetOrg === activeOrg) return true;
      switch (activeOrg) {
        case 'mttq':
          return ['supervision', 'welfare', 'ethnicity_religion'].includes(r.category);
        case 'youth':
          return r.category === 'youth_field';
        case 'women':
          return r.category === 'women_field';
        case 'veterans':
          return r.category === 'veterans_field';
        case 'union':
          return r.category === 'union_field';
        case 'farmers':
          return r.category === 'farmer_field';
        default:
          return false;
      }
    });
  }, [activeOrg, fieldReports]);

  const pendingCount = filteredReports.filter((r) => r.status === 'pending').length;
  const processingCount = filteredReports.filter((r) => r.status === 'processing').length;
  const doneCount = filteredReports.filter((r) => r.status === 'done').length;

  const ratedReports = filteredReports.filter((r) => r.satisfactionRating && r.satisfactionRating > 0);
  const avgRating = React.useMemo(() => {
    if (ratedReports.length === 0) return '5.0';
    const sum = ratedReports.reduce((acc, curr) => acc + (curr.satisfactionRating || 5), 0);
    return (sum / ratedReports.length).toFixed(1);
  }, [ratedReports]);

  const handleOpenDetail = (id: string) => {
    navigation.navigate('ReportDetail', { id });
  };

  const ORGS = [
    { key: 'all', label: 'Tất cả Khối' },
    { key: 'mttq', label: '🏛️ Ủy ban MTTQ' },
    { key: 'youth', label: '🚩 Đoàn Thanh niên' },
    { key: 'women', label: '👩 Hội Phụ nữ' },
    { key: 'veterans', label: '🎖️ Hội CCB' },
    { key: 'union', label: '🛠️ Công đoàn' },
    { key: 'farmers', label: '🌾 Hội Nông dân' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={roleConfig.themeColor} />

      {/* Role-tailored Styled Header */}
      <SafeAreaView style={[styles.headerSafe, { backgroundColor: roleConfig.themeColor }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.emblemBadge, { backgroundColor: roleConfig.lightBg }]}>
              <MaterialCommunityIcons name={roleConfig.iconName as any} size={24} color={roleConfig.themeColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.headerSub}>{roleConfig.badgeTitle}</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveText}>LÃNH ĐẠO</Text>
                </View>
              </View>
              <Text style={styles.officerName}>{user?.fullName || 'Đồng chí Nguyễn Văn Minh'}</Text>
              <Text style={styles.officerDept}>{user?.titleName || roleConfig.roleTitle}</Text>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity
              style={{ position: 'relative', padding: 8 }}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="bell-outline" size={26} color="#FFFFFF" />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: '#FFEBEE',
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#D32F2F' }}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Member Org Filter Bar */}
        <View style={styles.orgBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.orgScroll}>
            {ORGS.map((org) => (
              <TouchableOpacity
                key={org.key}
                style={[styles.orgChip, activeOrg === org.key && styles.orgChipActive]}
                onPress={() => setActiveOrg(org.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.orgChipText, activeOrg === org.key && styles.orgChipTextActive]}>
                  {org.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Specialized Directive Banner */}
        <View style={[styles.specialBanner, { backgroundColor: roleConfig.lightBg, borderColor: roleConfig.themeColor + '40' }]}>
          <MaterialCommunityIcons name="bullhorn-outline" size={20} color={roleConfig.themeColor} />
          <Text style={[styles.specialBannerText, { color: roleConfig.themeColor }]}>
            {roleConfig.specialNoticeText}
          </Text>
        </View>

        {/* KPI Metrics Summary Grid */}
        <View style={styles.kpiSection}>
          <Text style={styles.sectionTitle}>Chỉ số Xử lý Ý kiến & Văn bản Phản hồi</Text>
          <View style={styles.kpiGrid}>
            <View style={[styles.kpiCard, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }]}>
              <View style={styles.kpiHeader}>
                <MaterialCommunityIcons name="inbox-arrow-down" size={20} color="#D32F2F" />
                <Text style={[styles.kpiValue, { color: '#D32F2F' }]}>{pendingCount}</Text>
              </View>
              <Text style={styles.kpiLabel}>Mới tiếp nhận</Text>
            </View>

            <View style={[styles.kpiCard, { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' }]}>
              <View style={styles.kpiHeader}>
                <MaterialCommunityIcons name="clock-fast" size={20} color="#E65100" />
                <Text style={[styles.kpiValue, { color: '#E65100' }]}>{processingCount}</Text>
              </View>
              <Text style={styles.kpiLabel}>Đang xử lý</Text>
            </View>

            <View style={[styles.kpiCard, { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' }]}>
              <View style={styles.kpiHeader}>
                <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color="#2E7D32" />
                <Text style={[styles.kpiValue, { color: '#2E7D32' }]}>{doneCount}</Text>
              </View>
              <Text style={styles.kpiLabel}>Đã ban hành</Text>
            </View>

            <View style={[styles.kpiCard, { backgroundColor: '#FFF8E1', borderColor: '#FFE082' }]}>
              <View style={styles.kpiHeader}>
                <MaterialCommunityIcons name="star-circle" size={20} color="#F57F17" />
                <Text style={[styles.kpiValue, { color: '#F57F17' }]}>{avgRating}/5 ⭐</Text>
              </View>
              <Text style={styles.kpiLabel}>Nhân dân đánh giá</Text>
            </View>
          </View>
        </View>

        {/* Quick Officer Action Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Công cụ Xử lý Nhanh</Text>
          <View style={styles.toolsRow}>
            <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={() => navigation.navigate('FieldReport')}>
              <View style={[styles.toolIconBox, { backgroundColor: '#FFEBEE' }]}>
                <MaterialCommunityIcons name="file-document-edit" size={24} color="#D32F2F" />
              </View>
              <Text style={styles.toolText}>Phản ánh tiếp nhận</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolItem}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(roleConfig.specializedToolRoute as any)}
            >
              <View style={[styles.toolIconBox, { backgroundColor: roleConfig.lightBg }]}>
                <MaterialCommunityIcons name={roleConfig.specializedToolIcon as any} size={24} color={roleConfig.themeColor} />
              </View>
              <Text style={styles.toolText}>{roleConfig.specializedToolText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={() => navigation.navigate('CreateReport', { type: 'field' })}>
              <View style={[styles.toolIconBox, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#1565C0" />
              </View>
              <Text style={styles.toolText}>Tạo Thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={() => navigation.navigate('FeedbackMap')}>
              <View style={[styles.toolIconBox, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="#2E7D32" />
              </View>
              <Text style={styles.toolText}>Bản đồ thực địa</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task Feed: Feedbacks Awaiting Officer Action */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ý kiến & Phản ánh thuộc Nhiệm vụ của bạn</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FieldReport')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reportList}>
            {filteredReports.length === 0 ? (
              <View style={styles.emptyBox}>
                <MaterialCommunityIcons name="check-decagram-outline" size={40} color={Colors.textHint} />
                <Text style={styles.emptyText}>Chưa có ý kiến nào thuộc mảng này cần xử lý.</Text>
              </View>
            ) : (
              filteredReports.slice(0, 5).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.reportCard}
                  onPress={() => handleOpenDetail(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.deptChip}>
                      <MaterialCommunityIcons name="office-building" size={13} color="#1565C0" />
                      <Text style={styles.deptText}>
                        {item.departmentAssigned || 'Ủy ban MTTQ Xã'}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status === 'done'
                              ? '#E8F5E9'
                              : item.status === 'processing'
                              ? '#FFF3E0'
                              : '#FFEBEE',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.status === 'done'
                                ? '#2E7D32'
                                : item.status === 'processing'
                                ? '#E65100'
                                : '#D32F2F',
                          },
                        ]}
                      >
                        {item.status === 'done'
                          ? 'Đã ban hành'
                          : item.status === 'processing'
                          ? 'Đang xử lý'
                          : 'Chờ phân công'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.reportTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.reportAddress} numberOfLines={1}>
                    📍 {item.address}
                  </Text>

                  {item.ubndResponse ? (
                    <View style={styles.responseNotice}>
                      <MaterialCommunityIcons name="file-check-outline" size={14} color="#2E7D32" />
                      <Text style={styles.responseNoticeText} numberOfLines={1}>
                        📄 {item.ubndResponse.documentNumber || 'Đã ban hành văn bản'}: "{item.ubndResponse.officialContent}"
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.responseNotice, { backgroundColor: '#FFF3E0' }]}>
                      <MaterialCommunityIcons name="clock-alert-outline" size={14} color="#E65100" />
                      <Text style={[styles.responseNoticeText, { color: '#E65100' }]}>
                        ⚠️ Cần Thường trực soạn & ban hành văn bản phản hồi công dân
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={styles.reportTime}>{item.timeAgo}</Text>
                    <View style={styles.actionBtn}>
                      <Text style={[styles.actionBtnText, { color: roleConfig.themeColor }]}>
                        {item.ubndResponse ? 'Xem & Chỉnh sửa' : 'Soạn Văn bản Trả lời'}
                      </Text>
                      <MaterialCommunityIcons name="chevron-right" size={16} color={roleConfig.themeColor} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: {
    backgroundColor: '#B71C1C',
    paddingBottom: Spacing.xs,
    elevation: 4,
    ...Shadow.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  emblemBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerSub: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },
  liveBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3 },
  liveText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  officerName: { fontSize: FontSize.md, fontWeight: '800', color: '#FFF' },
  officerDept: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)' },

  orgBar: { marginTop: Spacing.xs },
  orgScroll: { paddingHorizontal: Spacing.base, gap: Spacing.xs },
  orgChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  orgChipActive: { backgroundColor: '#FFFFFF' },
  orgChipText: { fontSize: FontSize.xs, color: '#FFFFFF', fontWeight: '600' },
  orgChipTextActive: { color: '#111111', fontWeight: '800' },

  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.base },

  specialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  specialBannerText: { flex: 1, fontSize: FontSize.xs, fontWeight: '600', lineHeight: 18 },

  kpiSection: { gap: Spacing.xs },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  kpiGrid: { flexDirection: 'row', gap: Spacing.xs },
  kpiCard: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 2,
  },
  kpiHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kpiValue: { fontSize: FontSize.md, fontWeight: '800' },
  kpiLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },

  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },

  toolsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.xs },
  toolItem: { flex: 1, alignItems: 'center', gap: 4 },
  toolIconBox: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  toolText: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },

  reportList: { gap: Spacing.sm },
  reportCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deptChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  deptText: { fontSize: 10, color: '#1565C0', fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: '800' },
  reportTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  reportAddress: { fontSize: FontSize.xs, color: Colors.textSecondary },

  responseNotice: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', padding: Spacing.sm, borderRadius: BorderRadius.sm, marginTop: 2 },
  responseNoticeText: { fontSize: FontSize.xs, color: '#2E7D32', flex: 1, fontWeight: '600' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: Colors.divider },
  reportTime: { fontSize: 11, color: Colors.textHint },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionBtnText: { fontSize: FontSize.xs, fontWeight: '700' },

  emptyBox: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  emptyText: { fontSize: FontSize.xs, color: Colors.textHint },
});
