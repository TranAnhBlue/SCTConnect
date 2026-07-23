import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FieldReport } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useReportStore } from '../../store/reportStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const OfficerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuthStore();
  const fieldReports = useReportStore((state) => state.fieldReports);

  const pendingCount = fieldReports.filter((r) => r.status === 'pending').length;
  const processingCount = fieldReports.filter((r) => r.status === 'processing').length;
  const doneCount = fieldReports.filter((r) => r.status === 'done').length;

  const handleOpenDetail = (id: string) => {
    navigation.navigate('ReportDetail', { id });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Official Red Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.emblemBadge}>
              <MaterialCommunityIcons name="shield-account" size={24} color="#D32F2F" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={styles.headerSub}>CỔNG THÔNG TIN QUẢN LÝ UBND XÃ</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveText}>CÁN BỘ</Text>
                </View>
              </View>
              <Text style={styles.officerName}>{user?.fullName || 'Cán bộ Nguyễn Văn Minh'}</Text>
              <Text style={styles.officerDept}>{user?.department || 'Bộ phận Địa chính - Xây dựng & Đô thị'}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* KPI Metrics Summary Grid */}
        <View style={styles.kpiSection}>
          <Text style={styles.sectionTitle}>Báo cáo & Chỉ số Tổng quan</Text>
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
                <Text style={[styles.kpiValue, { color: '#F57F17' }]}>4.9/5</Text>
              </View>
              <Text style={styles.kpiLabel}>Hài lòng người dân</Text>
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

            <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={() => navigation.navigate('CreateReport', { type: 'field' })}>
              <View style={[styles.toolIconBox, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#1565C0" />
              </View>
              <Text style={styles.toolText}>Tạo Thông báo Xã</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={() => navigation.navigate('FeedbackMap')}>
              <View style={[styles.toolIconBox, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="#2E7D32" />
              </View>
              <Text style={styles.toolText}>Bản đồ thực địa</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolItem} activeOpacity={0.8} onPress={() => navigation.navigate('BottomTab', { screen: 'Messages' } as any)}>
              <View style={[styles.toolIconBox, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="chat-processing-outline" size={24} color="#E65100" />
              </View>
              <Text style={styles.toolText}>Hộp thư Tiếp dân</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task Feed: Feedbacks Awaiting Officer Action */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ý kiến & Phản ánh chờ Cán bộ Xử lý</Text>
            <TouchableOpacity onPress={() => navigation.navigate('FieldReport')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reportList}>
            {fieldReports.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.taskCard}
                activeOpacity={0.85}
                onPress={() => handleOpenDetail(item.id)}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
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
                        styles.statusPillText,
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
                        ? 'Đã trả lời'
                        : item.status === 'processing'
                        ? 'Đang xử lý'
                        : 'Mới gửi'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskAddress} numberOfLines={1}>
                  📍 {item.address}
                </Text>

                {item.ubndResponse ? (
                  <View style={styles.responseBox}>
                    <Text style={styles.responseBoxTitle}>
                      📄 Văn bản chỉ đạo: {item.ubndResponse.documentNumber || 'Số 89/TB-UBND'}
                    </Text>
                    <Text style={styles.responseBoxText} numberOfLines={2}>
                      "{item.ubndResponse.officialContent}"
                    </Text>
                  </View>
                ) : (
                  <View style={styles.pendingActionBox}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#D32F2F" />
                    <Text style={styles.pendingActionText}>Chưa có văn bản trả lời • Nhấn để soạn ngay</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleOpenDetail(item.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons name="pencil-box-multiple" size={16} color="#FFF" />
                  <Text style={styles.actionBtnText}>
                    {item.ubndResponse ? 'Xem & Chỉnh sửa Văn bản' : 'Soạn Văn bản Trả lời Người dân'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerSafe: { backgroundColor: '#B71C1C' },
  header: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.base,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  emblemBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerSub: { fontSize: 10, fontWeight: '800', color: '#FFCDD2', letterSpacing: 0.5 },
  liveBadge: { backgroundColor: '#D32F2F', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  liveText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  officerName: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFFFFF', marginTop: 1 },
  officerDept: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.85)' },

  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.md },

  /* KPI */
  kpiSection: { gap: Spacing.xs },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kpiValue: { fontSize: FontSize.xl, fontWeight: '800' },
  kpiLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },

  /* Tools */
  section: { gap: Spacing.sm },
  toolsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: BorderRadius.lg, ...Shadow.sm },
  toolItem: { alignItems: 'center', width: 72, gap: 4 },
  toolIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  toolText: { fontSize: FontSize.xs, color: Colors.textPrimary, textAlign: 'center', fontWeight: '500' },

  /* Task Feed */
  reportList: { gap: Spacing.md },
  taskCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  categoryBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusPillText: { fontSize: FontSize.xs, fontWeight: '700' },
  taskTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  taskAddress: { fontSize: FontSize.xs, color: Colors.textSecondary },
  responseBox: { backgroundColor: '#F1F8E9', padding: Spacing.sm, borderRadius: BorderRadius.sm, gap: 2, marginTop: 4 },
  responseBoxTitle: { fontSize: FontSize.xs, fontWeight: '700', color: '#2E7D32' },
  responseBoxText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontStyle: 'italic' },
  pendingActionBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFEBEE', padding: Spacing.sm, borderRadius: BorderRadius.sm, marginTop: 4 },
  pendingActionText: { fontSize: FontSize.xs, color: '#D32F2F', fontWeight: '600' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 6,
    marginTop: Spacing.xs,
  },
  actionBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.xs },
});
