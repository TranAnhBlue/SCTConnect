import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';

const menuItems = [
  { icon: 'account-circle-outline', label: 'Thông tin cá nhân' },
  { icon: 'shield-account-outline', label: 'Bảo mật & Phân quyền' },
  { icon: 'bell-outline', label: 'Cài đặt thông báo' },
  { icon: 'help-circle-outline', label: 'Hỗ trợ & Hướng dẫn' },
  { icon: 'information-outline', label: 'Về SCTConnect' },
];

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated, user, logout } = useAuthStore();

  const isOfficer = isAuthenticated && !!(user?.role && user.role !== 'citizen');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Profile header */}
      <View style={[styles.profileHeader, isOfficer && { backgroundColor: '#B71C1C' }]}>
        <View style={styles.avatar}>
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <MaterialCommunityIcons name="account" size={48} color={isOfficer ? '#B71C1C' : Colors.primary} />
          )}
        </View>

        <Text style={styles.name}>{isAuthenticated ? user?.fullName : 'Khách'}</Text>
        <Text style={styles.email}>
          {isAuthenticated
            ? (isOfficer ? `${user?.titleName || 'Lãnh đạo Mặt trận'}: ${user?.department || 'Cơ quan MTTQ Xã'}` : `Số ĐT: ${user?.phone} • ${user?.village?.name || 'Cấp Xã'}`)
            : 'Đăng nhập để gửi phản ánh & nhận thông báo từ Mặt trận Tổ quốc'}
        </Text>

        {isAuthenticated && (
          <View style={[styles.roleBadge, { backgroundColor: isOfficer ? '#FFEBEE' : '#E3F2FD' }]}>
            <MaterialCommunityIcons
              name={isOfficer ? 'shield-check' : 'account-check'}
              size={15}
              color={isOfficer ? '#D32F2F' : Colors.primary}
            />
            <Text style={[styles.roleBadgeText, { color: isOfficer ? '#D32F2F' : Colors.primary }]}>
              {isOfficer ? (user?.titleName || 'Lãnh Đạo Mặt Trận Tổ Quốc') : 'Công Dân Đã Xác Thực'}
            </Text>
          </View>
        )}

        {isAuthenticated ? (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              logout();
              Alert.alert('Đăng xuất thành công');
            }}
          >
            <MaterialCommunityIcons name="logout" size={16} color="#FFFFFF" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginText}>Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => {
              if (!isAuthenticated) {
                Alert.alert(
                  'Yêu cầu Đăng nhập',
                  `Vui lòng đăng nhập tài khoản để truy cập tính năng "${item.label}".`,
                  [
                    { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
                    { text: 'Đóng', style: 'cancel' },
                  ]
                );
              } else {
                Alert.alert(item.label, 'Tính năng bảo mật tài khoản đã được bảo vệ.');
              }
            }}
          >
            <MaterialCommunityIcons name={item.icon as any} size={22} color={isOfficer ? '#B71C1C' : Colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textHint} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

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
    overflow: 'hidden',
    ...Shadow.md,
  },
  avatarImg: { width: '100%', height: '100%' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  roleBadgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  logoutText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: '600' },
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
