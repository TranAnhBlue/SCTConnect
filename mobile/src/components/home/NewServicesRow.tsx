import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appFeatures } from '../../constants/features';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';

import { useAuthStore } from '../../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Alert } from 'react-native';

export const NewServicesRow: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useAuthStore();

  const handlePress = (screen?: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        '🔒 Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản Công dân để sử dụng các dịch vụ tiện ích mới.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }
    if (screen) {
      navigation.navigate(screen as any);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {appFeatures.map(item => (
        <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.75} onPress={() => handlePress(item.screen)}>
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
