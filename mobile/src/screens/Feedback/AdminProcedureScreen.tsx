import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, AdminProcedureReport, ReportStatus } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { mockAdminReports } from '../../api/mockData';
import { useAuthStore } from '../../store/authStore';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList> };

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  done: 'Đã xử lý',
  rejected: 'Từ chối',
};
const STATUS_COLOR: Record<ReportStatus, string> = {
  pending: Colors.statusPending,
  processing: Colors.statusProcessing,
  done: Colors.statusDone,
  rejected: Colors.statusRejected,
};

const ReportRow: React.FC<{ item: AdminProcedureReport }> = ({ item }) => (
  <TouchableOpacity style={styles.row} activeOpacity={0.82}>
    <View style={styles.iconBox}>
      <MaterialCommunityIcons name="file-document-outline" size={28} color={Colors.accent} />
    </View>
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.name}>{item.reporterName}</Text>
      <View style={styles.meta}>
        <Text style={styles.time}>{item.timeAgo}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={[styles.status, { color: STATUS_COLOR[item.status] }]}>
          {STATUS_LABEL[item.status]}
        </Text>
      </View>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textHint} />
  </TouchableOpacity>
);

export const AdminProcedureScreen: React.FC<Props> = ({ navigation }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filtered = searchText.trim()
    ? mockAdminReports.filter(r =>
        r.title.toLowerCase().includes(searchText.toLowerCase()) ||
        r.reporterName.toLowerCase().includes(searchText.toLowerCase())
      )
    : mockAdminReports;

  const { isAuthenticated } = useAuthStore();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {showSearch ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        ) : (
          <Text style={styles.appBarTitle}>Phản ánh thủ tục hành chính</Text>
        )}
        <TouchableOpacity style={styles.iconBtn} onPress={() => { setShowSearch(!showSearch); setSearchText(''); }}>
          <MaterialCommunityIcons name={showSearch ? 'close' : 'magnify'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{mockAdminReports.filter(r => r.status === 'pending').length}</Text>
          <Text style={styles.statLabel}>Chờ xử lý</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: Colors.statusProcessing }]}>
            {mockAdminReports.filter(r => r.status === 'processing').length}
          </Text>
          <Text style={styles.statLabel}>Đang xử lý</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: Colors.statusDone }]}>
            {mockAdminReports.filter(r => r.status === 'done').length}
          </Text>
          <Text style={styles.statLabel}>Đã xử lý</Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => <ReportRow item={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="file-document-outline" size={56} color={Colors.border} />
            <Text style={styles.emptyText}>Không có phản ánh nào</Text>
          </View>
        }
      />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomTab}>
          <MaterialCommunityIcons name="account-group" size={22} color={Colors.primary} />
          <Text style={[styles.bottomTabText, { color: Colors.primary, fontWeight: '600' }]}>Cộng đồng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (!isAuthenticated) {
              Alert.alert(
                'Yêu cầu Đăng nhập',
                'Vui lòng đăng nhập tài khoản để gửi phản ánh Thủ tục Hành chính.',
                [
                  { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
                  { text: 'Đóng', style: 'cancel' },
                ]
              );
              return;
            }
            navigation.navigate('CreateReport', { type: 'admin' });
          }}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
          <Text style={styles.fabLabel}>Tạo phản ánh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomTab}>
          <MaterialCommunityIcons name="account-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.bottomTabText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    minHeight: 56,
  },
  appBarTitle: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
  },
  iconBtn: { padding: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: '#FFFFFF',
    marginHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)',
    paddingVertical: 4,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingVertical: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.divider, marginVertical: 4 },
  list: { backgroundColor: Colors.surface, flexGrow: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1, gap: 3 },
  title: { fontSize: FontSize.base, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },
  name: { fontSize: FontSize.sm, color: Colors.textSecondary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  time: { fontSize: FontSize.xs, color: Colors.textHint },
  dot: { fontSize: FontSize.xs, color: Colors.textHint },
  status: { fontSize: FontSize.xs, fontWeight: '600' },
  sep: { height: 1, backgroundColor: Colors.divider },
  empty: { flex: 1, alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyText: { fontSize: FontSize.base, color: Colors.textHint },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  bottomTab: { flex: 1, alignItems: 'center', gap: 2 },
  bottomTabText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 4,
    ...Shadow.lg,
  },
  fabLabel: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: '700' },
});
