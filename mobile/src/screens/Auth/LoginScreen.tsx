import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const login = useAuthStore((state) => state.login);

  const [role, setRole] = useState<'citizen' | 'officer'>('citizen');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại đăng nhập');
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      await login(phone, password, role);
      setIsLoading(false);
      Alert.alert('Thành công!', `Xin chào ${role === 'officer' ? 'Cán bộ Mặt Trận' : 'Công dân'}!`, [
        {
          text: 'Vào Bảng điều khiển',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ]);
    }, 600);
  };

  const handleQuickLoginCitizen = async () => {
    setRole('citizen');
    setPhone('0912345678');
    setPassword('123456');
    setIsLoading(true);
    setTimeout(async () => {
      await login('0912345678', '123456', 'citizen', 'Trần Anh (Công dân)');
      setIsLoading(false);
      Alert.alert('Đã đăng nhập!', 'Bạn đang sử dụng quyền Công Dân.', [
        {
          text: 'Trải nghiệm ngay',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ]);
    }, 500);
  };

  const handleQuickLoginOfficer = async () => {
    setRole('officer');
    setPhone('0988123456');
    setPassword('123456');
    setIsLoading(true);
    setTimeout(async () => {
      await login('0988123456', '123456', 'officer', 'Nguyễn Văn Minh (Cán bộ Mặt trận)', 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã');
      setIsLoading(false);
      Alert.alert('Đã đăng nhập!', 'Bạn đang sử dụng quyền Cán Bộ Mặt Trận.', [
        {
          text: 'Bắt đầu công tác',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          {/* Header Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* Logo & Brand Title */}
          <View style={styles.brandContainer}>
            <Image
              source={require('../../../assets/logo.png') as any}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>SCTConnect - MẶT TRẬN TỔ QUỐC</Text>
            <Text style={styles.appDesc}>Cổng Đại Đoàn Kết & Tiếp Nhận Ý Kiến Nhân Dân</Text>
          </View>

          {/* Role Switcher Tabs */}
          <View style={styles.roleTabs}>
            <TouchableOpacity
              style={[styles.roleTab, role === 'citizen' && styles.roleTabActive]}
              onPress={() => setRole('citizen')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="account"
                size={18}
                color={role === 'citizen' ? '#FFFFFF' : Colors.textSecondary}
              />
              <Text style={[styles.roleTabText, role === 'citizen' && styles.roleTabTextActive]}>
                Công Dân
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === 'officer' && styles.roleTabActiveOfficer]}
              onPress={() => setRole('officer')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="shield-account"
                size={18}
                color={role === 'officer' ? '#FFFFFF' : Colors.textSecondary}
              />
              <Text style={[styles.roleTabText, role === 'officer' && styles.roleTabTextActive]}>
                Cán Bộ Mặt Trận
              </Text>
            </TouchableOpacity>
          </View>

          {/* Role Badge Indicator */}
          <View style={[styles.roleInfoBadge, { backgroundColor: role === 'officer' ? '#FFEBEE' : '#E3F2FD' }]}>
            <MaterialCommunityIcons
              name={role === 'officer' ? 'shield-check' : 'information'}
              size={18}
              color={role === 'officer' ? '#D32F2F' : Colors.primary}
            />
            <Text style={[styles.roleInfoText, { color: role === 'officer' ? '#D32F2F' : Colors.primary }]}>
              {role === 'officer'
                ? 'Dành riêng cho Lãnh đạo MTTQ & 5 Tổ chức CT-XH (Đoàn TN, Phụ nữ, CCB, Công đoàn, Nông dân) tiếp nhận & xử lý kiến nghị'
                : 'Dành cho nhân dân gửi kiến nghị Giám sát, An sinh xã hội & tương tác với Khối Đại đoàn kết'}
            </Text>
          </View>

          {/* Input Form */}
          <View style={styles.form}>
            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <View style={styles.inputContainer}>
                <View style={styles.flagBadge}>
                  <Text style={styles.flagText}>🇻🇳 +84</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập số điện thoại..."
                  placeholderTextColor={Colors.textHint}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mật khẩu / Mã PIN</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Nhập mật khẩu..."
                  placeholderTextColor={Colors.textHint}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={Colors.textHint}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: role === 'officer' ? '#D32F2F' : Colors.primary },
              ]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="login" size={20} color="#FFFFFF" />
                  <Text style={styles.submitText}>
                    Đăng nhập vai trò {role === 'officer' ? 'Cán Bộ Mặt Trận' : 'Công Dân'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Demo Login Triggers */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>🏛️ Chọn Vai trò Thử nghiệm (Mô hình MTTQ 2025):</Text>

            <TouchableOpacity
              style={styles.demoBtnCitizen}
              onPress={async () => {
                setIsLoading(true);
                await login('0912345678', '123456', 'citizen', 'Trần Anh (Công dân)');
                setIsLoading(false);
                Alert.alert('Đăng nhập thành công!', 'Bạn đang dùng quyền Công dân / Đoàn viên / Hội viên.', [
                  { text: 'Trải nghiệm ngay', onPress: () => navigation.popToTop() },
                ]);
              }}
            >
              <MaterialCommunityIcons name="account-check" size={16} color={Colors.primary} />
              <Text style={styles.demoBtnTextCitizen}>👤 Công Dân / Đoàn viên / Hội viên</Text>
            </TouchableOpacity>

            <View style={styles.demoGrid}>
              <TouchableOpacity
                style={[styles.demoOrgBtn, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }]}
                onPress={async () => {
                  setIsLoading(true);
                  await login('0988123456', '123456', 'mttq_president', 'Đồng chí Nguyễn Văn Minh', 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã', 'mttq', 'Chủ tịch Ủy ban MTTQ Xã');
                  setIsLoading(false);
                  Alert.alert('Đăng nhập thành công!', 'Quyền: Chủ tịch Ủy ban MTTQ Xã (Người đứng đầu Cơ quan).', [
                    { text: 'Vào Bảng điều khiển', onPress: () => navigation.popToTop() },
                  ]);
                }}
              >
                <MaterialCommunityIcons name="shield-account" size={16} color="#B71C1C" />
                <Text style={[styles.demoOrgText, { color: '#B71C1C' }]}>👑 Chủ tịch Ủy ban MTTQ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoOrgBtn, { backgroundColor: '#E3F2FD', borderColor: '#BBDEFB' }]}
                onPress={async () => {
                  setIsLoading(true);
                  await login('0988111222', '123456', 'youth_leader', 'Đồng chí Lê Hoàng Nam', 'Đoàn TNCS Hồ Chí Minh Xã', 'youth', 'Phó Chủ tịch MTTQ kiêm Bí thư Đoàn');
                  setIsLoading(false);
                  Alert.alert('Đăng nhập thành công!', 'Quyền: Phó Chủ tịch MTTQ kiêm Bí thư Đoàn Thanh niên.', [
                    { text: 'Vào Bảng điều khiển', onPress: () => navigation.popToTop() },
                  ]);
                }}
              >
                <MaterialCommunityIcons name="flag" size={16} color="#1565C0" />
                <Text style={[styles.demoOrgText, { color: '#1565C0' }]}>🚩 Bí thư Đoàn Thanh niên</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoOrgBtn, { backgroundColor: '#FCE4EC', borderColor: '#F8BBD0' }]}
                onPress={async () => {
                  setIsLoading(true);
                  await login('0988333444', '123456', 'women_leader', 'Đồng chí Phạm Thị Mai', 'Hội Liên hiệp Phụ nữ Xã', 'women', 'Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Phụ nữ');
                  setIsLoading(false);
                  Alert.alert('Đăng nhập thành công!', 'Quyền: Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Phụ nữ.', [
                    { text: 'Vào Bảng điều khiển', onPress: () => navigation.popToTop() },
                  ]);
                }}
              >
                <MaterialCommunityIcons name="human-female" size={16} color="#C2185B" />
                <Text style={[styles.demoOrgText, { color: '#C2185B' }]}>👩 Chủ tịch Hội Phụ nữ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoOrgBtn, { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' }]}
                onPress={async () => {
                  setIsLoading(true);
                  await login('0988555666', '123456', 'veteran_leader', 'Đồng chí Trần Văn Hùng', 'Hội Cựu chiến binh Xã', 'veterans', 'Phó Chủ tịch MTTQ kiêm Chủ tịch Hội CCB');
                  setIsLoading(false);
                  Alert.alert('Đăng nhập thành công!', 'Quyền: Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Cựu Chiến Binh.', [
                    { text: 'Vào Bảng điều khiển', onPress: () => navigation.popToTop() },
                  ]);
                }}
              >
                <MaterialCommunityIcons name="medal" size={16} color="#2E7D32" />
                <Text style={[styles.demoOrgText, { color: '#2E7D32' }]}>🎖️ Chủ tịch Hội Cựu chiến binh</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Register Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={styles.footerText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => Alert.alert('Đăng ký', 'Tính năng đăng ký tài khoản công dân tự động qua VNeID / CCCD.')}>
              <Text style={styles.registerLink}> Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.md, paddingBottom: 40 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: { alignItems: 'center', marginTop: Spacing.xs },
  logoImage: { width: 140, height: 110, marginBottom: Spacing.xs },
  appName: { fontSize: FontSize.xxl || 22, fontWeight: '800', color: Colors.primary },
  appDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },

  /* Role Tabs */
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginTop: Spacing.xs,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  roleTabActive: { backgroundColor: Colors.primary },
  roleTabActiveOfficer: { backgroundColor: '#D32F2F' },
  roleTabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  roleTabTextActive: { color: '#FFFFFF', fontWeight: '700' },

  /* Role Info */
  roleInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  roleInfoText: { fontSize: FontSize.xs, flex: 1, lineHeight: 18, fontWeight: '500' },

  /* Form */
  form: { gap: Spacing.md, marginTop: Spacing.xs },
  fieldGroup: { gap: 6 },
  label: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  flagBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    backgroundColor: '#F5F5F5',
  },
  flagText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  eyeBtn: { padding: Spacing.sm },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.md,
    marginTop: Spacing.xs,
  },
  submitText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },

  /* Demo */
  demoSection: {
    backgroundColor: '#F8F9FA',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  demoTitle: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  demoRow: { flexDirection: 'row', gap: Spacing.sm },
  demoBtnCitizen: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  demoBtnTextCitizen: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '700' },
  demoBtnOfficer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  demoBtnTextOfficer: { fontSize: FontSize.xs, color: '#D32F2F', fontWeight: '700' },

  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 4,
  },
  demoOrgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
    width: '48%',
  },
  demoOrgText: {
    fontSize: 11,
    fontWeight: '700',
  },
  /* Footer */
  footerPrompt: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.sm },
  footerText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  registerLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});
