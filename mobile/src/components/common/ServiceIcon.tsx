import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Shadow } from '../../constants';

interface ServiceIconProps {
  label: string;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  isNew?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  label,
  iconName,
  iconColor,
  backgroundColor,
  isNew = false,
  onPress,
  size = 'md',
}) => {
  const iconSize = size === 'lg' ? 70 : size === 'md' ? 60 : 52;
  const iconPxSize = size === 'lg' ? 32 : size === 'md' ? 28 : 24;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconContainer, { backgroundColor, width: iconSize, height: iconSize, borderRadius: iconSize / 4 }, Shadow.sm]}>
        <MaterialCommunityIcons name={iconName as any} size={iconPxSize} color={iconColor} />
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>Mới</Text>
          </View>
        )}
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: 76,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: Colors.tagNew,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  label: {
    marginTop: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
});
