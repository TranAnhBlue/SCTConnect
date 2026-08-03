import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, DistrictReport } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { mockStats, mockDistrictReports } from '../../api/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList> };

type FilterStatus = 'all' | 'pending' | 'processing' | 'done' | 'rejected';

const FILTER_CHIPS: { key: FilterStatus; label: string; color: string }[] = [
  { key: 'pending', label: 'Chờ xử lý', color: Colors.statusPending },
  { key: 'processing', label: 'Đang xử lý', color: Colors.statusProcessing },
  { key: 'done', label: 'Đã xử lý', color: Colors.statusDone },
  { key: 'rejected', label: 'Từ chối', color: Colors.statusRejected },
];

const ProgressBar: React.FC<{ district: DistrictReport }> = ({ district }) => {
  const total = district.total || 1;
  return (
    <View style={styles.progressBar}>
      <View style={[styles.pb, { flex: (district.pending / total) * 100, backgroundColor: Colors.statusPending }]} />
      <View style={[styles.pb, { flex: (district.processing / total) * 100, backgroundColor: Colors.statusProcessing }]} />
      <View style={[styles.pb, { flex: (district.done / total) * 100, backgroundColor: Colors.statusDone }]} />
      <View style={[styles.pb, { flex: (district.rejected / total) * 100, backgroundColor: Colors.statusRejected }]} />
    </View>
  );
};

const StatRow: React.FC<{ dotColor: string; label: string; value: number; valueColor?: string }> = ({
  dotColor, label, value, valueColor,
}) => (
  <View style={styles.statRow}>
    <View style={[styles.dot, { backgroundColor: dotColor }]} />
    <Text style={styles.statKey}>{label}</Text>
    <Text style={[styles.statVal, valueColor ? { color: valueColor } : {}]}>{value}</Text>
  </View>
);

const DistrictCard: React.FC<{ item: DistrictReport }> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
      <View style={styles.locationRow}>
        <View style={styles.locationIcon}>
          <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.districtName}>{item.name}</Text>
          <Text style={styles.districtSub}>{item.total.toLocaleString('vi-VN')} phản ánh</Text>
        </View>
      </View>
      <View style={styles.overdueBox}>
        <Text style={styles.overdueNum}>{item.overdue}</Text>
        <Text style={styles.overdueLabel}>quá hạn</Text>
      </View>
    </View>

    <ProgressBar district={item} />

    <View style={styles.statsGrid}>
      <View style={styles.statsCol}>
        <StatRow dotColor={Colors.statusPending} label="Chờ xử lý" value={item.pending} />
        <StatRow dotColor={Colors.statusDone} label="Đã xử lý" value={item.done} valueColor={Colors.statusDone} />
      </View>
      <View style={styles.statsCol}>
        <StatRow dotColor={Colors.statusProcessing} label="Đang xử lý" value={item.processing} valueColor={Colors.statusProcessing} />
        <StatRow dotColor={Colors.statusRejected} label="Từ chối" value={item.rejected} valueColor={Colors.statusRejected} />
      </View>
    </View>

    <View style={styles.divider} />
    <Text style={styles.satisfyTitle}>Mức độ hài lòng</Text>
    <View style={styles.statsGrid}>
      <View style={styles.statsCol}>
        <StatRow dotColor={Colors.statusProcessing} label="Không hài lòng" value={item.dissatisfied} valueColor={Colors.statusProcessing} />
      </View>
      <View style={styles.statsCol}>
        <StatRow dotColor={Colors.statusRejected} label="Rất không hài lòng" value={item.veryDissatisfied} valueColor={Colors.statusRejected} />
      </View>
    </View>
  </View>
);

import { useAuthStore } from '../../store/authStore';

export const FeedbackMapScreen: React.FC<Props> = ({ navigation }) => {
  const { isAuthenticated } = useAuthStore();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const checkPinAuth = (title: string, msg: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        '🔒 Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản Công dân để xem thông tin chi tiết trên bản đồ phản ánh.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }
    Alert.alert(title, msg);
  };

  const filtered = mockDistrictReports.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Bản đồ phản ánh</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: Colors.statusPending }]}>
            {mockStats.pending.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.statLabel}>Chờ xử lý</Text>
        </View>
        <View style={styles.vertDiv} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: Colors.statusProcessing }]}>
            {mockStats.processing.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.statLabel}>Đang xử lý</Text>
        </View>
        <View style={styles.vertDiv} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: Colors.statusDone }]}>
            {mockStats.done.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.statLabel}>Đã xử lý</Text>
        </View>
        <View style={styles.vertDiv} />
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: Colors.statusRejected }]}>
            {mockStats.rejected.toLocaleString('vi-VN')}
          </Text>
          <Text style={styles.statLabel}>Từ chối</Text>
        </View>
      </View>

      {/* Toggle view */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={15}
            color={viewMode === 'list' ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            Phường, xã
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={15}
            color={viewMode === 'map' ? Colors.primary : Colors.textSecondary}
          />
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Bản đồ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={18} color={Colors.textHint} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm phường/xã..."
          placeholderTextColor={Colors.textHint}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textHint} />
          </TouchableOpacity>
        )}
      </View>

      {/* Status filter chips */}
      <View style={styles.filterRow}>
        {FILTER_CHIPS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filterStatus === f.key && { borderColor: f.color, backgroundColor: f.color + '18' }]}
            onPress={() => setFilterStatus(filterStatus === f.key ? 'all' : f.key)}
          >
            <View style={[styles.filterDot, { backgroundColor: f.color }]} />
            <Text style={[styles.filterText, filterStatus === f.key && { color: f.color, fontWeight: '700' }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={({ item }) => <DistrictCard item={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="map-search-outline" size={56} color={Colors.border} />
              <Text style={styles.emptyText}>Không tìm thấy phường/xã</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          {/* Simulated Interactive Map Grid */}
          <View style={styles.mapCanvas}>
            <MaterialCommunityIcons name="map-legend" size={24} color="#1565C0" style={styles.mapLegendIcon} />
            <Text style={styles.mapTitleHeader}>BẢN ĐỒ THỰC ĐỊA PHẢN ÁNH - XÃ THANH OAI</Text>

            {/* Map Pin 1 */}
            <TouchableOpacity
              style={[styles.mapPin, { top: '25%', left: '20%' }]}
              onPress={() => checkPinAuth('📍 Thôn 1 - Xã Thanh Oai', 'Có 14 phản ánh (2 chờ xử lý, 12 đã hoàn thành).')}
            >
              <View style={[styles.pinBubble, { backgroundColor: '#D32F2F' }]}>
                <Text style={styles.pinText}>Thôn 1 (14)</Text>
              </View>
              <MaterialCommunityIcons name="map-marker" size={32} color="#D32F2F" />
            </TouchableOpacity>

            {/* Map Pin 2 */}
            <TouchableOpacity
              style={[styles.mapPin, { top: '45%', left: '60%' }]}
              onPress={() => checkPinAuth('📍 Thôn 2 - Xã Thanh Oai', 'Có 28 phản ánh (5 chờ xử lý, 23 đã hoàn thành).')}
            >
              <View style={[styles.pinBubble, { backgroundColor: '#E65100' }]}>
                <Text style={styles.pinText}>Thôn 2 (28)</Text>
              </View>
              <MaterialCommunityIcons name="map-marker" size={32} color="#E65100" />
            </TouchableOpacity>

            {/* Map Pin 3 */}
            <TouchableOpacity
              style={[styles.mapPin, { top: '65%', left: '35%' }]}
              onPress={() => checkPinAuth('📍 Khố Phố Chợ - Xã Thanh Oai', 'Có 42 phản ánh (1 chờ xử lý, 41 đã hoàn thành).')}
            >
              <View style={[styles.pinBubble, { backgroundColor: '#2E7D32' }]}>
                <Text style={styles.pinText}>Phố Chợ (42)</Text>
              </View>
              <MaterialCommunityIcons name="map-marker" size={32} color="#2E7D32" />
            </TouchableOpacity>

            <View style={styles.mapFooterNote}>
              <Text style={styles.mapFooterText}>💡 Chạm vào các ghim địa bàn để xem chi tiết kiến nghị từng khu vực</Text>
            </View>
          </View>
        </View>
      )}
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
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  iconBtn: { padding: Spacing.sm },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FontSize.lg, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  vertDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: -14,
    borderRadius: BorderRadius.full,
    padding: 3,
    ...Shadow.md,
    zIndex: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  toggleActive: { backgroundColor: '#E3F0FF' },
  toggleText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  toggleTextActive: { color: Colors.primary, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.textPrimary },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterDot: { width: 7, height: 7, borderRadius: 3.5 },
  filterText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  list: { padding: Spacing.base, paddingTop: Spacing.sm },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  districtName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  districtSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  overdueBox: { alignItems: 'flex-end' },
  overdueNum: { fontSize: 22, fontWeight: '900', color: Colors.statusRejected },
  overdueLabel: { fontSize: FontSize.xs, color: Colors.statusRejected, fontWeight: '600' },
  progressBar: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 3.5,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  pb: { height: 7 },
  statsGrid: { flexDirection: 'row', gap: Spacing.md },
  statsCol: { flex: 1, gap: 5 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statKey: { flex: 1, fontSize: FontSize.xs, color: Colors.textSecondary },
  statVal: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.sm },
  satisfyTitle: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  mapText: { fontSize: FontSize.base, color: Colors.textSecondary },
  mapSub: { fontSize: FontSize.sm, color: Colors.textHint },
  empty: { flex: 1, alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyText: { fontSize: FontSize.base, color: Colors.textHint },

  /* Map Canvas Styles */
  mapContainer: { flex: 1, padding: Spacing.base },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E8F1F5',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  mapLegendIcon: { position: 'absolute', top: 12, right: 12 },
  mapTitleHeader: { fontSize: 11, fontWeight: '800', color: '#1565C0', letterSpacing: 0.5 },
  mapPin: { position: 'absolute', alignItems: 'center' },
  pinBubble: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: -4,
    ...Shadow.sm,
  },
  pinText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  mapFooterNote: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapFooterText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
});
