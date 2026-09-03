import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../api/authService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const VILLAGES = [
  'Thôn Chiến Chiện',
  'Thôn Thanh Cao',
  'Thôn Cao Dương',
  'Thôn Bình Minh',
  'Thôn Tam Hưng',
  'Thôn Cự Khê',
  'Thôn Bích Hòa',
  'Thôn Mỹ Hưng',
  'Thôn Phương Trung',
  'Thôn khác / Vãng lai',
];

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedVillage, setSelectedVillage] = useState(VILLAGES[0]);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState<'citizen' | 'youth' | 'women' | 'veterans'>('citizen');

  const register = useAuthStore((state) => state.register);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Họ và tên của bạn.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Số điện thoại liên hệ.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 11) {
      Alert.alert('Số điện thoại không hợp lệ', 'Vui lòng nhập số điện thoại chính xác.');
      return;
    }
    if (!password) {
      Alert.alert('Thiếu mật khẩu', 'Vui lòng nhập Mật khẩu bảo vệ tài khoản.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu phải có ít nhất 6 ký tự để đảm bảo an toàn.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp', 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        phone: cleanPhone,
        password,
      });

      Alert.alert(
        'Đăng ký thành công 🎉',
        `Chào mừng ${fullName.trim()} đã gia nhập SCT Connect!`,
        [
          {
            text: 'Bắt đầu sử dụng',
            onPress: () => navigation.navigate('BottomTab'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Đăng ký thất bại', err.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký Tài khoản</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {/* Banner Giới thiệu */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIcon}>
              <MaterialCommunityIcons name="shield-account" size={32} color="#D32F2F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Hệ thống Phản ánh & Tiếp dân</Text>
              <Text style={styles.bannerSubtitle}>
                Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai
              </Text>
            </View>
          </View>

          {/* Chọn loại vai trò */}
          <Text style={styles.sectionLabel}>Tôi là:</Text>
          <View style={styles.roleGrid}>
            <TouchableOpacity
              style={[
                styles.roleChip,
                accountType === 'citizen' && styles.roleChipActive,
              ]}
              onPress={() => setAccountType('citizen')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="account"
                size={18}
                color={accountType === 'citizen' ? '#FFF' : '#424242'}
              />
              <Text
                style={[
                  styles.roleChipText,
                  accountType === 'citizen' && styles.roleChipTextActive,
                ]}
              >
                Công dân
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleChip,
                accountType === 'youth' && styles.roleChipActive,
              ]}
              onPress={() => setAccountType('youth')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="flag-variant-outline"
                size={18}
                color={accountType === 'youth' ? '#FFF' : '#424242'}
              />
              <Text
                style={[
                  styles.roleChipText,
                  accountType === 'youth' && styles.roleChipTextActive,
                ]}
              >
                Đoàn Thanh niên
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleChip,
                accountType === 'women' && styles.roleChipActive,
              ]}
              onPress={() => setAccountType('women')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="account-child-circle"
                size={18}
                color={accountType === 'women' ? '#FFF' : '#424242'}
              />
              <Text
                style={[
                  styles.roleChipText,
                  accountType === 'women' && styles.roleChipTextActive,
                ]}
              >
                Hội Phụ nữ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleChip,
                accountType === 'veterans' && styles.roleChipActive,
              ]}
              onPress={() => setAccountType('veterans')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="medal-outline"
                size={18}
                color={accountType === 'veterans' ? '#FFF' : '#424242'}
              />
              <Text
                style={[
                  styles.roleChipText,
                  accountType === 'veterans' && styles.roleChipTextActive,
                ]}
              >
                Cựu chiến binh
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form điền thông tin */}
          <View style={styles.formCard}>
            {/* Họ tên */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Họ và tên <Text style={{ color: '#D32F2F' }}>*</Text>
              </Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="account-outline" size={20} color={Colors.textHint} />
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  placeholderTextColor={Colors.textHint}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Số điện thoại */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Số điện thoại đăng nhập <Text style={{ color: '#D32F2F' }}>*</Text>
              </Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="phone-outline" size={20} color={Colors.textHint} />
                <TextInput
                  style={styles.input}
                  placeholder="0912345678"
                  placeholderTextColor={Colors.textHint}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>
            </View>

            {/* Địa bàn Thôn */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Thôn / Cụm dân cư</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
              >
                {VILLAGES.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={[
                      styles.villageChip,
                      selectedVillage === v && styles.villageChipActive,
                    ]}
                    onPress={() => setSelectedVillage(v)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.villageChipText,
                        selectedVillage === v && styles.villageChipTextActive,
                      ]}
                    >
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Email (tùy chọn) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (nếu có)</Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="email-outline" size={20} color={Colors.textHint} />
                <TextInput
                  style={styles.input}
                  placeholder="nguyenvanan@gmail.com"
                  placeholderTextColor={Colors.textHint}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Mật khẩu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Mật khẩu (từ 6 ký tự) <Text style={{ color: '#D32F2F' }}>*</Text>
              </Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={Colors.textHint} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={Colors.textHint}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textHint}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Xác nhận mật khẩu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Xác nhận lại mật khẩu <Text style={{ color: '#D32F2F' }}>*</Text>
              </Text>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="lock-check-outline" size={20} color={Colors.textHint} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor={Colors.textHint}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {/* Cam kết */}
            <View style={styles.agreementRow}>
              <MaterialCommunityIcons name="shield-check-outline" size={18} color="#2E7D32" />
              <Text style={styles.agreementText}>
                Thông tin được mã hóa bảo mật & phục vụ liên hệ giải quyết phản ánh theo quy định.
              </Text>
            </View>

            {/* Nút Đăng ký */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="account-plus-outline" size={20} color="#FFF" />
                  <Text style={styles.submitBtnText}>Đăng ký Tài khoản</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Chuyển sang Đăng nhập */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Đã có tài khoản?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#B71C1C' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: '#B71C1C',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: '#FFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: 40,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#FFEBEE',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  bannerTitle: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: '#B71C1C',
  },
  bannerSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#EEEEEE',
  },
  roleChipActive: {
    backgroundColor: '#B71C1C',
  },
  roleChipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  roleChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    height: 46,
  },
  input: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  villageChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  villageChipActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1565C0',
  },
  villageChipText: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
  },
  villageChipTextActive: {
    color: '#1565C0',
    fontWeight: '700',
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: BorderRadius.md,
    marginTop: 4,
  },
  agreementText: {
    flex: 1,
    fontSize: 11,
    color: '#2E7D32',
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B71C1C',
    borderRadius: BorderRadius.full,
    paddingVertical: 14,
    marginTop: 8,
    ...Shadow.sm,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontSize: FontSize.base,
    fontWeight: '800',
    color: '#FFF',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#B71C1C',
    textDecorationLine: 'underline',
  },
});
