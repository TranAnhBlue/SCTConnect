import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../../constants';

const CATEGORY_MAP: Record<string, { label: string; bg: string; text: string }> = {
  supervision: { label: '🏛️ Giám sát & Phản biện', bg: '#FFEBEE', text: '#B71C1C' },
  welfare: { label: '🌺 An sinh xã hội & Quỹ cứu trợ', bg: '#FCE4EC', text: '#C2185B' },
  ethnicity_religion: { label: '🕊️ Dân tộc & Tôn giáo', bg: '#F3E5F5', text: '#7B1FA2' },
  youth_field: { label: '🚩 Đoàn Thanh niên', bg: '#E3F2FD', text: '#1565C0' },
  women_field: { label: '👩 Hội Phụ nữ', bg: '#FCE4EC', text: '#D81B60' },
  veterans_field: { label: '🎖️ Hội Cựu chiến binh', bg: '#E8F5E9', text: '#2E7D32' },
  union_field: { label: '🛠️ Công đoàn', bg: '#FFF3E0', text: '#E65100' },
  farmer_field: { label: '🌾 Hội Nông dân', bg: '#F9FBE7', text: '#827717' },
  environment: { label: '🌿 Vệ sinh môi trường', bg: '#E8F5E9', text: '#2E7D32' },
  security: { label: '👮 An ninh trật tự', bg: '#FFEBEE', text: '#C62828' },
  admin: { label: '📋 Phản ánh TTHC', bg: '#E3F2FD', text: '#0D47A1' },
};

interface CategoryChipProps {
  category?: string;
  label?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, label }) => {
  const item = category ? CATEGORY_MAP[category] : null;
  const displayLabel = item ? item.label : (label || category || 'Khối MTTQ');
  const bg = item ? item.bg : '#E3F2FD';
  const textColor = item ? item.text : Colors.primary;

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: textColor }]}>{displayLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
});
