import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { smartCityServices, ServiceItem } from '../../api/mockData';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';

interface ServiceGridProps {
  onServicePress: (service: ServiceItem) => void;
}

const ServiceCell: React.FC<{
  item: ServiceItem;
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
  // Row 1: items 0-3, Row 2: items 4-6
  const row1 = smartCityServices.slice(0, 4);
  const row2 = smartCityServices.slice(4);

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
