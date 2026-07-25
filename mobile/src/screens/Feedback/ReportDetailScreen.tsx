import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { AppBar, StatusBadge, CategoryChip } from '../../components/common';
import { mockFieldReports } from '../../api/mockData/fieldReports';
import { FieldReport, UbndFeedbackResponse } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useReportStore } from '../../store/reportStore';
import { useNotificationStore } from '../../store/notificationStore';

import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportDetail'>;

export const ReportDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = route?.params?.id || '1';
  const { user, isAuthenticated } = useAuthStore();
  const isOfficer = isAuthenticated && !!(user?.role && user.role !== 'citizen');

  // Live store report
  const fieldReports = useReportStore((state) => state.fieldReports);
  const report = fieldReports.find((r) => r.id === id) || fieldReports[0];
  const [userRating, setUserRating] = useState<number>(report.satisfactionRating || 0);

  // Officer modal state
  const [officerModalVisible, setOfficerModalVisible] = useState(false);
  const [officerName, setOfficerName] = useState(report.ubndResponse?.officerName || user?.fullName || 'Đồng chí Nguyễn Văn Minh');
  const [officerDept, setOfficerDept] = useState(report.ubndResponse?.department || user?.titleName || user?.department || 'Ban Thường trực Ủy ban MTTQ Xã');
  const [docNumber, setDocNumber] = useState(report.ubndResponse?.documentNumber || 'Số 108/TB-MTTQ');
  const [responseText, setResponseText] = useState(report.ubndResponse?.officialContent || '');
  const [proofImage, setProofImage] = useState<string | null>(report.ubndResponse?.resultImageUrl || null);

  const handleOpenOfficerModal = () => {
    if (report.ubndResponse) {
      setOfficerName(report.ubndResponse.officerName || user?.fullName || 'Đồng chí Nguyễn Văn Minh');
      setOfficerDept(report.ubndResponse.department || 'Ban Thường trực Ủy ban MTTQ Xã');
      setDocNumber(report.ubndResponse.documentNumber || 'Số 108/TB-MTTQ');
      setResponseText(report.ubndResponse.officialContent || '');
      setProofImage(report.ubndResponse.resultImageUrl || null);
    }
    setOfficerModalVisible(true);
  };

  const handlePickProofImage = () => {
    Alert.alert('Tải ảnh thực địa minh chứng', 'Chọn phương thức đính kèm ảnh:', [
      {
        text: '📷 Chụp ảnh bằng Máy ảnh',
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) {
            Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền mở máy ảnh.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setProofImage(result.assets[0].uri);
          }
        },
      },
      {
        text: '🖼️ Chọn từ Thư viện ảnh',
        onPress: async () => {
          const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted) {
            Alert.alert('Quyền truy cập', 'Vui lòng cấp quyền mở thư viện ảnh.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.[0]?.uri) {
            setProofImage(result.assets[0].uri);
          }
        },
      },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const handleRate = async (rating: number) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản để đánh giá mức độ hài lòng.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }
    setUserRating(rating);
    await useReportStore.getState().rateReport(report.id, rating);

    // Trigger Notification for Receiving Officer
    useNotificationStore.getState().addNotification({
      title: '⭐ Đánh giá Mức độ Hài lòng',
      message: `Công dân ${report.reporterName || 'Trần Anh'} vừa đánh giá ${rating}/5 sao ⭐ cho kết quả xử lý của đơn vị.`,
      type: 'rating_received',
      targetRole: 'officer',
      targetOrg: (report as any).targetOrganization || 'mttq',
      senderName: report.reporterName || 'Trần Anh',
      reportId: report.id,
    });

    Alert.alert('Cảm ơn bạn!', `Bạn đã đánh giá ${rating} sao cho kết quả xử lý của MTTQ Xã và thông tin đã được lưu vào Database.`);
  };

  const handleSaveOfficerResponse = async () => {
    if (!responseText.trim()) {
      Alert.alert('Chưa nhập nội dung', 'Vui lòng nhập nội dung phản hồi của MTTQ Xã.');
      return;
    }

    const newResponse: UbndFeedbackResponse = {
      officerName: officerName.trim(),
      department: officerDept.trim(),
      officialContent: responseText.trim(),
      documentNumber: docNumber.trim(),
      responseDate: new Date().toLocaleString('vi-VN'),
      resultImageUrl: proofImage || 'https://picsum.photos/seed/fixed/400/250',
    };

    await useReportStore.getState().respondToReport(report.id, newResponse);

    // Trigger Notification for Citizen
    useNotificationStore.getState().addNotification({
      title: '🏛️ Ban hành Văn bản Trả lời Phản ánh',
      message: `Đồng chí ${officerName.trim()} (${officerDept.trim()}) đã ban hành Văn bản trả lời cho kiến nghị "${report.title}".`,
      type: 'report_responded',
      targetRole: 'citizen',
      senderName: officerName.trim(),
      reportId: report.id,
    });

    setOfficerModalVisible(false);
    Alert.alert('Thành công!', `Đã ban hành văn bản ${docNumber.trim()} và lưu trực tiếp vào Database MongoDB Cloud.`);
  };

  // Timeline step calculation
  const getTimelineStep = () => {
    switch (report.status) {
      case 'pending':
        return 1;
      case 'processing':
        return 2;
      case 'done':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getTimelineStep();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <AppBar
        title="Chi tiết Phản ánh & Phản hồi"
        showBack
        onBack={() => navigation.goBack()}
        variant="primary"
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Timeline Tracking Header Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Quy trình Tiếp nhận & Xử lý tại Mặt trận Tổ quốc Xã</Text>
          <View style={styles.stepContainer}>
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}>
                <MaterialCommunityIcons name="check" size={14} color="#FFF" />
              </View>
              <Text style={[styles.stepLabel, currentStep >= 1 && styles.stepLabelActive]}>
                Đã gửi
              </Text>
            </View>
            <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />

            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}>
                <MaterialCommunityIcons
                  name={currentStep >= 2 ? 'account-clock' : 'numeric-2'}
                  size={currentStep >= 2 ? 14 : 12}
                  color="#FFF"
                />
              </View>
              <Text style={[styles.stepLabel, currentStep >= 2 && styles.stepLabelActive]}>
                MTTQ Tiếp nhận
              </Text>
            </View>
            <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}>
                <MaterialCommunityIcons
                  name={currentStep >= 3 ? 'checkbox-marked-circle' : 'numeric-3'}
                  size={currentStep >= 3 ? 14 : 12}
                  color="#FFF"
                />
              </View>
              <Text style={[styles.stepLabel, currentStep >= 3 && styles.stepLabelActive]}>
                Đã phản hồi
              </Text>
            </View>
          </View>
        </View>

        {/* Citizen Report Main Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <CategoryChip category={report.category} />
            <StatusBadge status={report.status} />
          </View>

          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportTime}>
            <MaterialCommunityIcons name="clock-outline" size={13} color={Colors.textHint} />{' '}
            {report.timeAgo}
          </Text>

          <View style={styles.addressBox}>
            <MaterialCommunityIcons name="map-marker" size={16} color={Colors.primary} />
            <Text style={styles.addressText}>{report.address}</Text>
          </View>

          <View style={styles.departmentBadge}>
            <MaterialCommunityIcons name="account-circle-outline" size={15} color={Colors.primary} />
            <Text style={styles.departmentText}>
              Công dân gửi phản ánh: <Text style={{ fontWeight: '700', color: Colors.primary }}>{report.reporterName || 'Trần Anh'}</Text>
            </Text>
          </View>

          {report.departmentAssigned && (
            <View style={styles.departmentBadge}>
              <MaterialCommunityIcons name="office-building" size={15} color="#1565C0" />
              <Text style={styles.departmentText}>
                Đơn vị tiếp nhận: <Text style={{ fontWeight: '700' }}>{report.departmentAssigned}</Text>
              </Text>
            </View>
          )}

          <Text style={styles.descriptionLabel}>Nội dung ý kiến / phản ánh:</Text>
          <Text style={styles.descriptionText}>{report.description}</Text>

          {report.imageUrl && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: report.imageUrl }} style={styles.reportImage} />
            </View>
          )}
        </View>

        {/* Official MTTQ Xã Response Section */}
        {report.ubndResponse ? (
          <View style={styles.responseCard}>
            <View style={styles.responseHeader}>
              <View style={styles.emblemBadge}>
                <MaterialCommunityIcons name="shield-check" size={22} color="#D32F2F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responseHeaderTitle}>Ý kiến & Văn bản Phản hồi của Mặt trận Tổ quốc Xã</Text>
                <Text style={styles.responseDept}>{report.ubndResponse.department}</Text>
              </View>
            </View>

            {report.ubndResponse.documentNumber && (
              <View style={styles.docRow}>
                <MaterialCommunityIcons name="file-document-outline" size={15} color={Colors.primary} />
                <Text style={styles.docText}>
                  Văn bản chỉ đạo: <Text style={{ fontWeight: '700', color: Colors.primary }}>{report.ubndResponse.documentNumber}</Text>
                </Text>
                <Text style={styles.docDate}>{report.ubndResponse.responseDate}</Text>
              </View>
            )}

            <View style={styles.responseBody}>
              <Text style={styles.officerName}>
                Cán bộ phụ trách: <Text style={{ fontWeight: '700' }}>{report.ubndResponse.officerName}</Text>
              </Text>
              <Text style={styles.responseContent}>{report.ubndResponse.officialContent}</Text>

              {report.ubndResponse.resultImageUrl && (
                <View style={styles.resultImageContainer}>
                  <Text style={styles.resultImageTitle}>📸 Ảnh minh chứng kết quả xử lý thực địa:</Text>
                  <Image source={{ uri: report.ubndResponse.resultImageUrl }} style={styles.resultImage} />
                </View>
              )}
            </View>

            {/* Citizen Rating Section (Exclusively for Citizens when a response exists) */}
            {!isOfficer ? (
              <View style={styles.ratingSection}>
                <Text style={styles.ratingTitle}>Đánh giá mức độ hài lòng với kết quả xử lý của MTTQ Xã:</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRate(star)}
                      activeOpacity={0.7}
                      style={{ padding: 4 }}
                    >
                      <MaterialCommunityIcons
                        name={star <= userRating ? 'star' : 'star-outline'}
                        size={28}
                        color={star <= userRating ? '#FBC02D' : '#BDBDBD'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {userRating > 0 && (
                  <Text style={styles.ratingStatus}>
                    Cảm ơn bạn đã đánh giá ({userRating}/5 sao)!
                  </Text>
                )}
              </View>
            ) : (
              report.satisfactionRating && (
                <View style={styles.officerRatingBadge}>
                  <MaterialCommunityIcons name="star-circle" size={18} color="#F57F17" />
                  <Text style={styles.officerRatingText}>
                    Đánh giá từ Công dân <Text style={{ fontWeight: '800' }}>{report.reporterName || 'Trần Anh'}</Text>: <Text style={{ fontWeight: '800' }}>{report.satisfactionRating}/5 sao ⭐</Text>
                  </Text>
                </View>
              )
            )}
          </View>
        ) : (
          <View style={styles.pendingResponseCard}>
            <MaterialCommunityIcons name="progress-clock" size={32} color="#E65100" />
            <Text style={styles.pendingTitle}>
              {isOfficer ? 'Ý kiến / Phản ánh chưa được phản hồi' : 'Mặt trận đang tiếp nhận & phân công xử lý'}
            </Text>
            <Text style={styles.pendingSub}>
              {isOfficer
                ? 'Đồng chí vui lòng nhấn nút bên dưới để soạn & ban hành Văn bản trả lời Người dân.'
                : 'Ý kiến của bạn đã được chuyển tới bộ phận chuyên môn. Kết quả & văn bản phản hồi sẽ được cập nhật tại đây.'}
            </Text>
          </View>
        )}

        {/* Action Button Exclusively for Commune Officers */}
        {isOfficer && (
          <TouchableOpacity
            style={styles.officerBtn}
            onPress={handleOpenOfficerModal}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="badge-account-horizontal" size={20} color="#FFF" />
            <Text style={styles.officerBtnText}>
              {report.ubndResponse ? 'Cập nhật lại Văn bản chỉ đạo' : 'Ban hành Văn bản Phản hồi Người dân'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Officer Response Modal Sheet */}
      <Modal
        visible={officerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOfficerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập nhật Phản hồi của Mặt trận Tổ quốc Xã</Text>
              <TouchableOpacity onPress={() => setOfficerModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.inputLabel}>Tên Cán bộ tiếp nhận:</Text>
              <TextInput
                style={styles.textInput}
                value={officerName}
                onChangeText={setOfficerName}
                placeholder="Nhập tên cán bộ..."
              />

              <Text style={styles.inputLabel}>Bộ phận / Phòng ban / Tổ chức:</Text>
              <TextInput
                style={styles.textInput}
                value={officerDept}
                onChangeText={setOfficerDept}
                placeholder="Nhập tên tổ chức..."
              />

              <Text style={styles.inputLabel}>Số Văn bản / Thông báo (nếu có):</Text>
              <TextInput
                style={styles.textInput}
                value={docNumber}
                onChangeText={setDocNumber}
                placeholder="Ví dụ: Số 123/TB-MTTQ"
              />

              <Text style={styles.inputLabel}>Nội dung trả lời & Kết quả xử lý:</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
                value={responseText}
                onChangeText={setResponseText}
                placeholder="Nhập chi tiết nội dung chỉ đạo, biện pháp xử lý hoặc lịch trình khắc phục..."
                multiline
              />

              <Text style={styles.inputLabel}>Ảnh minh chứng xử lý thực địa:</Text>
              <TouchableOpacity style={styles.proofPhotoBtn} onPress={handlePickProofImage} activeOpacity={0.8}>
                {proofImage ? (
                  <Image source={{ uri: proofImage }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
                ) : (
                  <View style={styles.proofPhotoBox}>
                    <MaterialCommunityIcons name="camera-plus" size={24} color={Colors.primary} />
                    <Text style={styles.proofPhotoText}>Chụp ảnh hoặc chọn từ Thư viện</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleSaveOfficerResponse}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="send" size={18} color="#FFF" />
                <Text style={styles.submitModalBtnText}>Ban hành & Phản hồi Người dân</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.md, paddingBottom: 40 },
  
  /* Timeline */
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  timelineTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepLine: { flex: 1, height: 3, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.primary },
  stepLabel: { fontSize: FontSize.xs, color: Colors.textHint, fontWeight: '500' },
  stepLabelActive: { color: Colors.primary, fontWeight: '700' },

  /* Report Card */
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  reportTime: { fontSize: FontSize.xs, color: Colors.textHint },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3F2FD',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  addressText: { fontSize: FontSize.xs, color: Colors.primary, flex: 1, fontWeight: '500' },
  departmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  departmentText: { fontSize: FontSize.xs, color: '#E65100', flex: 1 },
  descriptionLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  descriptionText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  imageContainer: { marginTop: Spacing.xs, borderRadius: BorderRadius.md, overflow: 'hidden' },
  reportImage: { width: '100%', height: 180, borderRadius: BorderRadius.md },

  /* Response Card */
  responseCard: {
    backgroundColor: '#F1F8E9',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  responseHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  emblemBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseHeaderTitle: { fontSize: FontSize.md, fontWeight: '700', color: '#2E7D32' },
  responseDept: { fontSize: FontSize.xs, color: Colors.textSecondary },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    padding: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  docText: { fontSize: FontSize.xs, color: Colors.textSecondary, flex: 1 },
  docDate: { fontSize: FontSize.xs, color: Colors.textHint },
  responseBody: { backgroundColor: '#FFFFFF', padding: Spacing.md, borderRadius: BorderRadius.md, gap: Spacing.xs },
  officerName: { fontSize: FontSize.xs, color: Colors.textSecondary },
  responseContent: { fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 21 },
  resultImageContainer: { marginTop: Spacing.sm, gap: 6 },
  resultImageTitle: { fontSize: FontSize.xs, fontWeight: '700', color: '#2E7D32' },
  resultImage: { width: '100%', height: 160, borderRadius: BorderRadius.sm },

  /* Rating */
  ratingSection: { alignItems: 'center', marginTop: Spacing.xs, gap: 4 },
  ratingTitle: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary },
  starsRow: { flexDirection: 'row' },
  ratingStatus: { fontSize: FontSize.xs, color: '#2E7D32', fontWeight: '700' },
  officerRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF8E1',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFE082',
    marginTop: Spacing.xs,
  },
  officerRatingText: {
    fontSize: FontSize.xs,
    color: '#F57F17',
    fontWeight: '600',
  },

  /* Pending Response */
  pendingResponseCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#FFE082',
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pendingTitle: { fontSize: FontSize.md, fontWeight: '700', color: '#E65100', textAlign: 'center' },
  pendingSub: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center', lineHeight: 18 },

  /* Officer Action Button */
  officerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  officerBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    padding: Spacing.base,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  modalBody: { gap: Spacing.sm, paddingBottom: 20 },
  inputLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textSecondary },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  proofPhotoBtn: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  proofPhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    backgroundColor: '#F4F8FF',
  },
  proofPhotoText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  submitModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  submitModalBtnText: { color: '#FFF', fontWeight: '700', fontSize: FontSize.sm },
});
