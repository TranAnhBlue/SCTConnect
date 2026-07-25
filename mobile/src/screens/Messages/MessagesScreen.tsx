import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, BorderRadius } from '../../constants';
import { useAuthStore } from '../../store/authStore';

export const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isAuthenticated } = useAuthStore();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hộp thư Tiếp dân & Trò chuyện</Text>
      </View>

      <View style={styles.center}>
        <MaterialCommunityIcons
          name={!isAuthenticated ? 'lock-outline' : 'message-text-outline'}
          size={64}
          color={Colors.border}
        />
        <Text style={styles.title}>
          {!isAuthenticated ? '🔒 Yêu cầu Đăng nhập' : 'Hộp thư trống'}
        </Text>
        <Text style={styles.sub}>
          {!isAuthenticated
            ? 'Vui lòng đăng nhập tài khoản Công dân để trao đổi trực tiếp với Cán bộ Thường trực Mặt trận Tổ quốc Xã.'
            : 'Các cuộc trao đổi trực tiếp với Cán bộ tiếp dân sẽ hiển thị tại đây.'}
        </Text>

        {!isAuthenticated && (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Đăng nhập Ngay</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#B71C1C',
    padding: Spacing.base,
    paddingTop: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: 32 },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  sub: { fontSize: FontSize.xs, color: Colors.textHint, textAlign: 'center', lineHeight: 18 },
  loginBtn: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    marginTop: 12,
  },
  loginBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
});
