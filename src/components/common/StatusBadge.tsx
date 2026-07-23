import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReportStatus } from '../../types';
import { Colors, FontSize, BorderRadius } from '../../constants';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xử lý', color: Colors.statusPending, bg: '#F5F5F5' },
  processing: { label: 'Đang xử lý', color: Colors.statusProcessing, bg: '#FFF8E1' },
  done: { label: 'Đã xử lý', color: Colors.statusDone, bg: '#E8F5E9' },
  rejected: { label: 'Từ chối', color: Colors.statusRejected, bg: '#FFEBEE' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status];
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSm ? styles.sm : styles.md]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }, isSm ? styles.textSm : styles.textMd]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  md: { paddingHorizontal: 10, paddingVertical: 5, gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontWeight: '600' },
  textSm: { fontSize: FontSize.xs },
  textMd: { fontSize: FontSize.sm },
});
