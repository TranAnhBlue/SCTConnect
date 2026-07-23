import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants';

const menuItems = [
  { icon: 'account-circle-outline', label: 'Thông tin cá nhân' },
  { icon: 'shield-account-outline', label: 'Bảo mật tài khoản' },
  { icon: 'bell-outline', label: 'Cài đặt thông báo' },
  { icon: 'help-circle-outline', label: 'Hỗ trợ' },
  { icon: 'information-outline', label: 'Về ứng dụng' },
];

export const AccountScreen: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    {/* Profile header */}
    <View style={styles.profileHeader}>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name="account" size={48} color={Colors.primary} />
      </View>
      <Text style={styles.name}>Người dùng</Text>
      <Text style={styles.email}>Đăng nhập để sử dụng đầy đủ tính năng</Text>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Đăng nhập / Đăng ký</Text>
      </TouchableOpacity>
    </View>

    {/* Menu */}
    <View style={styles.menu}>
      {menuItems.map((item, i) => (
        <TouchableOpacity key={i} style={styles.menuRow} activeOpacity={0.7}>
          <MaterialCommunityIcons name={item.icon as any} size={22} color={Colors.primary} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textHint} />
        </TouchableOpacity>
      ))}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  profileHeader: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
  name: { fontSize: FontSize.xl, fontWeight: '700', color: '#fff' },
  email: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center', paddingHorizontal: Spacing.xl },
  loginBtn: {
    marginTop: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  loginText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.md },
  menu: {
    margin: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuLabel: { flex: 1, fontSize: FontSize.base, color: Colors.textPrimary },
});
