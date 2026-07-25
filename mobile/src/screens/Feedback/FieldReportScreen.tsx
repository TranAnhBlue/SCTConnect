import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FieldReport, ReportCategory, ReportStatus } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { useReportStore } from '../../store/reportStore';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList> };

const CATEGORIES: { key: ReportCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'supervision', label: '🏛️ Giám sát & Phản biện' },
  { key: 'welfare', label: '🌺 An sinh & Cứu trợ' },
  { key: 'ethnicity_religion', label: '🕊️ Dân tộc & Tôn giáo' },
  { key: 'youth_field', label: '🚩 Đoàn Thanh niên' },
  { key: 'women_field', label: '👩 Hội Phụ nữ' },
  { key: 'veterans_field', label: '🎖️ Hội Cựu chiến binh' },
  { key: 'union_field', label: '🛠️ Công đoàn' },
  { key: 'farmer_field', label: '🌾 Hội Nông dân' },
  { key: 'environment', label: '🌿 Môi trường' },
  { key: 'security', label: '👮 An ninh' },
];

const STATUS_DOT: Record<ReportStatus, string> = {
  pending: Colors.statusPending,
  processing: Colors.statusProcessing,
  done: Colors.statusDone,
  rejected: Colors.statusRejected,
};

const ReportCard: React.FC<{ item: FieldReport; onPress: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.82} onPress={onPress}>
    {item.imageUrl ? (
      <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
    ) : (
      <View style={[styles.thumb, styles.thumbPlaceholder]}>
        <MaterialCommunityIcons name="image-off" size={24} color={Colors.textHint} />
      </View>
    )}
    <View style={styles.cardBody}>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardAddress} numberOfLines={1}>
        <MaterialCommunityIcons name="map-marker-outline" size={11} color={Colors.textHint} />
        {' '}{item.address}
      </Text>

      {item.ubndResponse ? (
        <View style={styles.responseNoticeTag}>
          <MaterialCommunityIcons name="bell-ring" size={12} color="#2E7D32" />
          <Text style={styles.responseNoticeText}>
            MTTQ ĐÃ PHẢN HỒI: {item.ubndResponse.documentNumber || 'Đã xử lý xong'}
          </Text>
        </View>
      ) : (
        <View style={styles.pendingNoticeTag}>
          <MaterialCommunityIcons name="clock-outline" size={12} color="#E65100" />
          <Text style={styles.pendingNoticeText}>Mặt trận đang tiếp nhận & xử lý</Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
        <View style={styles.likesRow}>
          <MaterialCommunityIcons name="thumb-up-outline" size={12} color={Colors.textHint} />
          <Text style={styles.likeCount}>{item.likes}</Text>
          <MaterialCommunityIcons name="comment-outline" size={12} color={Colors.textHint} />
          <Text style={styles.likeCount}>{item.comments}</Text>
        </View>
      </View>
    </View>
    {/* Status dot */}
    <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[item.status] }]} />
  </TouchableOpacity>
);

export const FieldReportScreen: React.FC<Props> = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState<ReportCategory | 'all'>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const fieldReports = useReportStore((state) => state.fieldReports);

  useEffect(() => {
    useReportStore.getState().fetchFieldReports();
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory === 'all'
      ? fieldReports
      : fieldReports.filter(r => r.category === activeCategory);
    if (searchText.trim()) {
      list = list.filter(r =>
        r.title.toLowerCase().includes(searchText.toLowerCase()) ||
        r.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return list;
  }, [activeCategory, searchText, fieldReports]);

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
            placeholder="Tìm kiếm phản ánh..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
        ) : (
          <Text style={styles.appBarTitle}>Phản ánh hiện trường</Text>
        )}
        <View style={styles.appBarRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { setShowSearch(!showSearch); setSearchText(''); }}>
            <MaterialCommunityIcons name={showSearch ? 'close' : 'magnify'} size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="map-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category filter */}
      <View style={styles.chipBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.key}
              style={[styles.chip, activeCategory === c.key && styles.chipActive]}
              onPress={() => setActiveCategory(c.key as any)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, activeCategory === c.key && styles.chipTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>{filtered.length} phản ánh</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <ReportCard
            item={item}
            onPress={() => navigation.navigate('ReportDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="clipboard-text-off-outline" size={56} color={Colors.border} />
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
          onPress={() => navigation.navigate('CreateReport', { type: 'field' })}
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
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: Spacing.sm,
  },
  appBarRight: { flexDirection: 'row', alignItems: 'center' },
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
  chipBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  chips: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  countBar: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    backgroundColor: Colors.background,
  },
  countText: { fontSize: FontSize.xs, color: Colors.textHint },
  list: { paddingBottom: Spacing.base },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    position: 'relative',
  },
  thumb: {
    width: 80,
    height: 72,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.border,
  },
  thumbPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  cardAddress: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 16 },
  responseNoticeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  responseNoticeText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '700',
  },
  pendingNoticeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  pendingNoticeText: {
    fontSize: 10,
    color: '#E65100',
    fontWeight: '600',
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  timeAgo: { fontSize: FontSize.xs, color: Colors.textHint },
  likesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  likeCount: { fontSize: FontSize.xs, color: Colors.textHint },
  statusDot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.base,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
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
