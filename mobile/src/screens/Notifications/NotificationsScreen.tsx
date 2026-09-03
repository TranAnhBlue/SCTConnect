import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore, AppNotification } from '../../store/notificationStore';

const NOTIF_ICONS: Record<AppNotification['type'], { icon: string; color: string; bg: string }> = {
  report_created: { icon: 'message-alert-outline', color: '#1565C0', bg: '#E3F2FD' },
  report_responded: { icon: 'file-document-check-outline', color: '#D32F2F', bg: '#FFEBEE' },
  reception_created: { icon: 'account-clock-outline', color: '#E65100', bg: '#FFF3E0' },
  reception_approved: { icon: 'check-decagram-outline', color: '#2E7D32', bg: '#E8F5E9' },
  rating_received: { icon: 'star-circle-outline', color: '#F57F17', bg: '#FFFDE7' },
};

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, isAuthenticated } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead, getNotificationsForUser } = useNotificationStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const role = user?.role || 'citizen';
  const org = (user?.organization?.code?.toLowerCase() || '') as any;
  const userNotifs = getNotificationsForUser(role, org, isAuthenticated);

  const filteredNotifs = filter === 'unread' ? userNotifs.filter((n) => !n.isRead) : userNotifs;
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  const handlePressNotif = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.reportId) {
      navigation.navigate('ReportDetail', { id: notif.reportId });
    }
  };

  const renderNotifItem = ({ item }: { item: AppNotification }) => {
    const config = NOTIF_ICONS[item.type] || NOTIF_ICONS.report_created;
    return (
      <TouchableOpacity
        style={[styles.notifCard, !item.isRead && styles.unreadCard]}
        onPress={() => handlePressNotif(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
          <MaterialCommunityIcons name={config.icon as any} size={24} color={config.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.cardMessage} numberOfLines={2}>
            {item.message}
          </Text>

          <Text style={styles.cardTime}>{item.createdAt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
              <MaterialCommunityIcons name="email-open-outline" size={16} color="#FFF" />
              <Text style={styles.markAllText}>Đọc tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Filter */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, filter === 'all' && styles.tabBtnActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
              Tất cả ({userNotifs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, filter === 'unread' && styles.tabBtnActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.tabText, filter === 'unread' && styles.tabTextActive]}>
              Chưa đọc ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifs}
        keyExtractor={(item) => item.id}
        renderItem={renderNotifItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name={!isAuthenticated ? 'lock-outline' : 'bell-off-outline'}
              size={64}
              color={Colors.border}
            />
            <Text style={styles.emptyTitle}>
              {!isAuthenticated ? '🔒 Yêu cầu Đăng nhập' : 'Không có thông báo mới'}
            </Text>
            <Text style={styles.emptySub}>
              {!isAuthenticated
                ? 'Vui lòng đăng nhập tài khoản Công dân hoặc Lãnh đạo để nhận thông báo về Phản ánh, Trả lời văn bản & Lịch tiếp dân.'
                : 'Các thông báo mới về Phản ánh, Trả lời văn bản & Lịch tiếp dân sẽ tự động hiển thị tại đây.'}
            </Text>
            {!isAuthenticated && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#B71C1C',
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginTop: 10,
                }}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.85}
              >
                <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13 }}>Đăng nhập Ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: '#FFF' },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  markAllText: { fontSize: FontSize.xs, color: '#FFF', fontWeight: '600' },

  tabContainer: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  tabBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabBtnActive: { backgroundColor: '#FFF' },
  tabText: { fontSize: FontSize.xs, color: '#FFF', fontWeight: '600' },
  tabTextActive: { color: '#B71C1C', fontWeight: '800' },

  listContent: { padding: Spacing.base, paddingBottom: 80 },
  separator: { height: Spacing.sm },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  unreadCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, gap: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D32F2F', marginLeft: 4 },
  cardMessage: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  cardTime: { fontSize: 10, color: Colors.textHint, marginTop: 4 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: Spacing.sm, paddingHorizontal: 32 },
  emptyTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: FontSize.xs, color: Colors.textHint, textAlign: 'center', lineHeight: 18 },
});
