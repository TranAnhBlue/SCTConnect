import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../api/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const login = useAuthStore((state) => state.login);

  const [role, setRole] = useState<'citizen' | 'officer'>('citizen');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register Modal States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<any>('citizen');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại đăng nhập');
      return;
    }

    setIsLoading(true);
    try {
      await login(phone.trim(), password, role === 'officer' ? 'mttq_president' : 'citizen');
      setIsLoading(false);
      Alert.alert('Đăng nhập thành công!', 'Tài khoản đã được xác thực từ MongoDB Cloud Database.', [
        {
          text: 'Vào Bảng điều khiển',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ]);
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert('Đăng nhập thất bại', err.message || 'Số điện thoại hoặc thông tin không hợp lệ');
    }
  };

  const handleRegisterSubmit = async () => {
    if (!regPhone.trim() || !regName.trim() || !regPassword.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Mật khẩu tự chọn');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await authService.registerApi({
        fullName: regName.trim(),
        phone: regPhone.trim(),
        password: regPassword.trim(),
        role: regRole,
        department: regRole !== 'citizen' ? 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã' : undefined,
      });

      // Automatically login after successful registration
      await login(regPhone.trim(), regPassword.trim(), regRole, regName.trim());
      setIsRegistering(false);
      setShowRegisterModal(false);

      Alert.alert(
        '🎉 Đăng ký thành công!',
        `Tài khoản "${regName.trim()}" với Mật khẩu đã chọn được bảo mật trên MongoDB Cloud Database.`,
        [
          {
            text: 'Bắt đầu sử dụng',
            onPress: () => navigation.popToTop(),
          },
        ]
      );
    } catch (err: any) {
      setIsRegistering(false);
      Alert.alert('Đăng ký thất bại', err.message || 'Số điện thoại có thể đã tồn tại');
    }
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.content} 
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          
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

            {/* Register Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Text style={{ fontSize: FontSize.xs, color: Colors.textSecondary }}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
                <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: role === 'officer' ? '#D32F2F' : Colors.primary, textDecorationLine: 'underline' }}>
                  Đăng ký tài khoản mới
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Demo Login Triggers */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>🏛️ Chọn Vai trò Thử nghiệm (Mô hình MTTQ 2026):</Text>

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
                <Text style={[styles.demoOrgText, { color: '#2E7D32' }]}>🎖️ Chủ tịch Hội CCB</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoOrgBtn, { backgroundColor: '#F9FBE7', borderColor: '#F0F4C3' }]}
                onPress={async () => {
                  setIsLoading(true);
                  await login('0988777888', '123456', 'farmer_leader', 'Đồng chí Nguyễn Văn Nông', 'Hội Nông dân Xã', 'farmers', 'Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Nông dân');
                  setIsLoading(false);
                  Alert.alert('Đăng nhập thành công!', 'Quyền: Phó Chủ tịch MTTQ kiêm Chủ tịch Hội Nông Dân.', [
                    { text: 'Vào Bảng điều khiển', onPress: () => navigation.popToTop() },
                  ]);
                }}
              >
                <MaterialCommunityIcons name="sprout" size={16} color="#827717" />
                <Text style={[styles.demoOrgText, { color: '#827717' }]}>🌾 Chủ tịch Hội Nông dân</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoOrgBtn, { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' }]}
                onPress={async () => {
                  setIsLoading(true);
                  await login('0988999000', '123456', 'union_leader', 'Đồng chí Hoàng Văn Công', 'Công đoàn / LĐLĐ Xã', 'union', 'Phó Chủ tịch MTTQ kiêm Chủ tịch Công đoàn');
                  setIsLoading(false);
                  Alert.alert('Đăng nhập thành công!', 'Quyền: Phó Chủ tịch MTTQ kiêm Chủ tịch Công Đoàn.', [
                    { text: 'Vào Bảng điều khiển', onPress: () => navigation.popToTop() },
                  ]);
                }}
              >
                <MaterialCommunityIcons name="tools" size={16} color="#E65100" />
                <Text style={[styles.demoOrgText, { color: '#E65100' }]}>🛠️ Chủ tịch Công đoàn</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Register Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={styles.footerText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => setShowRegisterModal(true)}>
              <Text style={styles.registerLink}> Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Đăng Ký Tài Khoản Mới */}
      <Modal visible={showRegisterModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📝 Đăng ký Tài khoản Mới</Text>
              <TouchableOpacity onPress={() => setShowRegisterModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={styles.modalForm}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Họ và Tên (*)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    placeholderTextColor={Colors.textHint}
                    value={regName}
                    onChangeText={setRegName}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Số điện thoại (*)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Ví dụ: 0912345678"
                    placeholderTextColor={Colors.textHint}
                    keyboardType="phone-pad"
                    value={regPhone}
                    onChangeText={setRegPhone}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Mật khẩu / Mã PIN (*)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Nhập mật khẩu tự chọn..."
                    placeholderTextColor={Colors.textHint}
                    secureTextEntry={true}
                    value={regPassword}
                    onChangeText={setRegPassword}
                  />
                </View>


                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Chọn Vai trò</Text>
                  <View style={styles.rolePickerRow}>
                    <TouchableOpacity
                      style={[styles.roleChip, regRole === 'citizen' && styles.roleChipActive]}
                      onPress={() => setRegRole('citizen')}
                    >
                      <Text style={[styles.roleChipText, regRole === 'citizen' && styles.roleChipTextActive]}>
                        👤 Công dân
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleChip, regRole === 'mttq_president' && styles.roleChipActiveOfficer]}
                      onPress={() => setRegRole('mttq_president')}
                    >
                      <Text style={[styles.roleChipText, regRole === 'mttq_president' && styles.roleChipTextActive]}>
                        🏛️ Cán bộ MTTQ
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleChip, regRole === 'youth_leader' && styles.roleChipActiveYouth]}
                      onPress={() => setRegRole('youth_leader')}
                    >
                      <Text style={[styles.roleChipText, regRole === 'youth_leader' && styles.roleChipTextActive]}>
                        🚩 Đoàn Thanh niên
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.registerSubmitBtn}
                  onPress={handleRegisterSubmit}
                  disabled={isRegistering}
                >
                  {isRegistering ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.registerSubmitText}>Xác nhận Đăng ký tài khoản MongoDB</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  </TouchableWithoutFeedback>
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

  /* Modal Register Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: Spacing.base,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl || 16,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  modalForm: { gap: Spacing.md, marginTop: Spacing.xs },
  modalInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  rolePickerRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: 4 },
  roleChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleChipActiveOfficer: { backgroundColor: '#D32F2F', borderColor: '#D32F2F' },
  roleChipActiveYouth: { backgroundColor: '#1565C0', borderColor: '#1565C0' },
  roleChipText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  roleChipTextActive: { color: '#FFFFFF', fontWeight: '800' },
  registerSubmitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadow.sm,
  },
  registerSubmitText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '700' },
});

