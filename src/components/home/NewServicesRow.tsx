import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { newServices } from '../../api/mockData';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';

export const NewServicesRow: React.FC = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {newServices.map(item => (
        <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.75}>
          <View style={[styles.iconBox, { backgroundColor: item.backgroundColor }]}>
            <MaterialCommunityIcons name={item.iconName as any} size={26} color={item.color} />
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newText}>Mới</Text>
              </View>
            )}
          </View>
          <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  item: {
    alignItems: 'center',
    width: 72,
    gap: Spacing.xs,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: Colors.tagNew,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
