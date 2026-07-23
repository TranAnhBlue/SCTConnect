import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';

interface AppBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showMap?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onSearch?: () => void;
  onMap?: () => void;
  onClose?: () => void;
  variant?: 'primary' | 'white';
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  subtitle,
  showBack = false,
  showSearch = false,
  showMap = false,
  showClose = false,
  onBack,
  onSearch,
  onMap,
  onClose,
  variant = 'primary',
}) => {
  const isPrimary = variant === 'primary';

  return (
    <View style={[styles.container, isPrimary ? styles.primary : styles.white]}>
      {/* Left */}
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={isPrimary ? '#FFFFFF' : Colors.textPrimary}
            />
          </TouchableOpacity>
        )}
        {!showBack && title && (
          <View style={styles.titleBlock}>
            <Text style={[styles.title, !isPrimary && styles.titleDark]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, !isPrimary && styles.subtitleDark]}>{subtitle}</Text>
            )}
          </View>
        )}
      </View>

      {/* Center title (when back is shown) */}
      {showBack && title && (
        <View style={styles.centerSection}>
          <Text style={[styles.titleCenter, !isPrimary && styles.titleDark]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      {/* Right */}
      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity onPress={onSearch} style={styles.iconBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={isPrimary ? '#FFFFFF' : Colors.textPrimary}
            />
          </TouchableOpacity>
        )}
        {showMap && (
          <TouchableOpacity onPress={onMap} style={styles.iconBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="map-outline"
              size={24}
              color={isPrimary ? '#FFFFFF' : Colors.textPrimary}
            />
          </TouchableOpacity>
        )}
        {showClose && (
          <TouchableOpacity onPress={onClose} style={styles.iconBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={isPrimary ? '#FFFFFF' : Colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    minHeight: 56,
    ...Shadow.sm,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  white: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  titleBlock: {
    marginLeft: 4,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    lineHeight: 24,
  },
  titleDark: {
    color: Colors.textPrimary,
  },
  titleCenter: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  subtitleDark: {
    color: Colors.textSecondary,
  },
});
