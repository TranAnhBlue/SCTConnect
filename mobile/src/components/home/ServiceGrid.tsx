import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appFeatures, AppFeatureItem } from '../../constants/features';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';

interface ServiceGridProps {
  onServicePress: (service: AppFeatureItem) => void;
}

const ServiceCell: React.FC<{
  item: AppFeatureItem;
  onPress: () => void;
}> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.cell} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.iconBox, { backgroundColor: item.backgroundColor }]}>
      <MaterialCommunityIcons name={item.iconName as any} size={26} color={item.color} />
    </View>
    <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
  </TouchableOpacity>
);

export const ServiceGrid: React.FC<ServiceGridProps> = ({ onServicePress }) => {
  // Row 1: items 0-2, Row 2: items 3-5
  const row1 = appFeatures.slice(0, 3);
  const row2 = appFeatures.slice(3, 6);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {row1.map(item => (
          <ServiceCell key={item.id} item={item} onPress={() => onServicePress(item)} />
        ))}
      </View>
      <View style={styles.row}>
        {row2.map(item => (
          <ServiceCell key={item.id} item={item} onPress={() => onServicePress(item)} />
        ))}
        {/* Fill empty slots so spacing is consistent */}
        {Array.from({ length: 4 - row2.length }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.cell} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    maxWidth: '25%',
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '400',
  },
});
