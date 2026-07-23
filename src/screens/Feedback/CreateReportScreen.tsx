import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ReportCategory } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'CreateReport'>;
};

const CATEGORIES: { key: ReportCategory; label: string }[] = [
  { key: 'security', label: 'An ninh trật tự' },
  { key: 'construction', label: 'Trật tự xây dựng' },
  { key: 'civilization', label: 'Văn minh đô thị' },
  { key: 'environment', label: 'Môi trường' },
  { key: 'traffic', label: 'Giao thông' },
];

export const CreateReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const isField = route.params.type === 'field';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề phản ánh');
      return;
    }
    if (isField && !address.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ xảy ra sự việc');
      return;
    }
    Alert.alert('Gửi thành công!', 'Phản ánh của bạn đã được ghi nhận và sẽ được xử lý sớm.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>
          {isField ? 'Phản ánh hiện trường' : 'Phản ánh TTHC'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Type badge */}
        <View style={[styles.typeBadge, { backgroundColor: isField ? '#EEF4FF' : '#E8F5E9' }]}>
          <MaterialCommunityIcons
            name={isField ? 'map-marker' : 'file-document-outline'}
            size={20}
            color={isField ? Colors.primary : Colors.accent}
          />
          <Text style={[styles.typeText, { color: isField ? Colors.primary : Colors.accent }]}>
            {isField ? 'Phản ánh hiện trường' : 'Phản ánh thủ tục hành chính'}
          </Text>
        </View>

        {/* Field: title */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tiêu đề <Text style={styles.req}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tiêu đề phản ánh..."
            placeholderTextColor={Colors.textHint}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Field: address (only for field) */}
        {isField && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Địa chỉ <Text style={styles.req}>*</Text></Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Nhập địa chỉ..."
                placeholderTextColor={Colors.textHint}
                value={address}
                onChangeText={setAddress}
              />
              <TouchableOpacity style={styles.locationBtn}>
                <MaterialCommunityIcons name="crosshairs-gps" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Field: category */}
        {isField && (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Lĩnh vực</Text>
            <TouchableOpacity
              style={[styles.input, styles.selectInput]}
              onPress={() => setShowCatPicker(!showCatPicker)}
            >
              <Text style={category ? styles.selectText : styles.selectPlaceholder}>
                {category ? CATEGORIES.find(c => c.key === category)?.label : 'Chọn lĩnh vực...'}
              </Text>
              <MaterialCommunityIcons
                name={showCatPicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textHint}
              />
            </TouchableOpacity>
            {showCatPicker && (
              <View style={styles.catList}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity
                    key={c.key}
                    style={[styles.catItem, category === c.key && styles.catItemActive]}
                    onPress={() => { setCategory(c.key); setShowCatPicker(false); }}
                  >
                    <Text style={[styles.catText, category === c.key && styles.catTextActive]}>
                      {c.label}
                    </Text>
                    {category === c.key && (
                      <MaterialCommunityIcons name="check" size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Field: Commune Department */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Đơn vị tiếp nhận tại UBND Xã</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
            {[
              'Địa chính - Xây dựng',
              'Môi trường & Hạ tầng',
              'Công an Xã',
              'Tư pháp - Hộ tịch',
              'Văn hóa - Xã hội',
              'Lãnh đạo UBND Xã',
            ].map((dept, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: index === 0 ? '#E3F2FD' : '#F5F5F5',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: index === 0 ? Colors.primary : Colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: index === 0 ? Colors.primary : Colors.textSecondary,
                    fontWeight: index === 0 ? '700' : '500',
                  }}
                >
                  {dept}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Field: description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nội dung mô tả</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Mô tả chi tiết vấn đề bạn muốn phản ánh..."
            placeholderTextColor={Colors.textHint}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Photo upload */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Hình ảnh / Video</Text>
          <TouchableOpacity style={styles.photoUpload}>
            <MaterialCommunityIcons name="camera-plus-outline" size={36} color={Colors.textHint} />
            <Text style={styles.photoTitle}>Thêm ảnh / video</Text>
            <Text style={styles.photoSub}>Tối đa 5 ảnh, 1 video • PNG, JPG, MP4</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
          <Text style={styles.submitText}>Gửi phản ánh</Text>
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
    textAlign: 'center',
  },
  iconBtn: { padding: Spacing.sm, width: 40 },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.md },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  typeText: { fontSize: FontSize.base, fontWeight: '600' },
  fieldGroup: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  req: { color: Colors.error },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  inputRow: { flexDirection: 'row', gap: Spacing.sm },
  locationBtn: {
    width: 46,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: FontSize.base, color: Colors.textPrimary },
  selectPlaceholder: { fontSize: FontSize.base, color: Colors.textHint },
  catList: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  catItemActive: { backgroundColor: '#EEF4FF' },
  catText: { fontSize: FontSize.base, color: Colors.textPrimary },
  catTextActive: { color: Colors.primary, fontWeight: '600' },
  textarea: { height: 120, paddingTop: Spacing.md },
  photoUpload: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  photoTitle: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: '500' },
  photoSub: { fontSize: FontSize.xs, color: Colors.textHint },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.base,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelText: { fontSize: FontSize.base, color: Colors.textSecondary, fontWeight: '600' },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    ...Shadow.md,
  },
  submitText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },
});
