import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, FontSize, Shadow, BorderRadius } from '../../constants';
import { AppBar, StatusBadge, CategoryChip } from '../../components/common';
import { mockFieldReports } from '../../api/mockData/fieldReports';
import { FieldReport, UbndFeedbackResponse } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportDetail'>;

export const ReportDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;

  // Local state initialized with mock data
  const initialReport = mockFieldReports.find((r) => r.id === id) || mockFieldReports[0];
  const [report, setReport] = useState<FieldReport>(initialReport);
  const [userRating, setUserRating] = useState<number>(report.satisfactionRating || 0);

  // Officer modal state
  const [officerModalVisible, setOfficerModalVisible] = useState(false);
  const [officerName, setOfficerName] = useState('Cán bộ Nguyễn Văn A');
  const [officerDept, setOfficerDept] = useState('Bộ phận Địa chính - Xây dựng UBND Xã');
  const [docNumber, setDocNumber] = useState('Số 105/TB-UBND');
  const [responseText, setResponseText] = useState('');

  const handleRate = (rating: number) => {
    setUserRating(rating);
    setReport((prev: FieldReport) => ({ ...prev, satisfactionRating: rating }));
    Alert.alert('Cảm ơn bạn!', `Bạn đã đánh giá ${rating} sao cho kết quả xử lý của UBND Xã.`);
  };

  const handleSaveOfficerResponse = () => {
    if (!responseText.trim()) {
      Alert.alert('Chưa nhập nội dung', 'Vui lòng nhập nội dung phản hồi của UBND Xã.');
      return;
    }

    const newResponse: UbndFeedbackResponse = {
      officerName: officerName.trim(),
      department: officerDept.trim(),
      officialContent: responseText.trim(),
      documentNumber: docNumber.trim(),
      responseDate: new Date().toLocaleString('vi-VN'),
      resultImageUrl: 'https://picsum.photos/seed/fixed/300/200',
    };

    setReport((prev: FieldReport) => ({
      ...prev,
      status: 'done',
      ubndResponse: newResponse,
    }));

    setOfficerModalVisible(false);
    Alert.alert('Thành công', 'Đã cập nhật văn bản & ý kiến phản hồi từ UBND Xã.');
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
          <Text style={styles.timelineTitle}>Quy trình Tiếp nhận & Xử lý tại UBND Xã</Text>
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
                UBND Tiếp nhận
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

        {/* Official UBND Xã Response Section */}
        {report.ubndResponse ? (
          <View style={styles.responseCard}>
            <View style={styles.responseHeader}>
              <View style={styles.emblemBadge}>
                <MaterialCommunityIcons name="shield-check" size={22} color="#D32F2F" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responseHeaderTitle}>Ý kiến & Văn bản Phản hồi của UBND Xã</Text>
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

            {/* Citizen Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingTitle}>Đánh giá mức độ hài lòng với kết quả xử lý:</Text>
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
          </View>
        ) : (
          <View style={styles.pendingResponseCard}>
            <MaterialCommunityIcons name="progress-clock" size={32} color="#E65100" />
            <Text style={styles.pendingTitle}>UBND Xã đang tiếp nhận & phân công xử lý</Text>
            <Text style={styles.pendingSub}>
              Ý kiến của bạn đã được chuyển tới bộ phận chuyên môn. Kết quả & văn bản phản hồi sẽ được cập nhật tại đây.
            </Text>
          </View>
        )}

        {/* Action Button for Commune Officers */}
        <TouchableOpacity
          style={styles.officerBtn}
          onPress={() => setOfficerModalVisible(true)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="badge-account-horizontal" size={20} color="#FFF" />
          <Text style={styles.officerBtnText}>Dành cho Cán bộ UBND Xã: Cập nhật phản hồi</Text>
        </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Cập nhật Phản hồi của UBND Xã</Text>
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

              <Text style={styles.inputLabel}>Bộ phận / Phòng ban Xã:</Text>
              <TextInput
                style={styles.textInput}
                value={officerDept}
                onChangeText={setOfficerDept}
                placeholder="Nhập tên bộ phận..."
              />

              <Text style={styles.inputLabel}>Số Văn bản / Thông báo (nếu có):</Text>
              <TextInput
                style={styles.textInput}
                value={docNumber}
                onChangeText={setDocNumber}
                placeholder="Ví dụ: Số 123/TB-UBND"
              />

              <Text style={styles.inputLabel}>Nội dung trả lời & Kết quả xử lý:</Text>
              <TextInput
                style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
                value={responseText}
                onChangeText={setResponseText}
                placeholder="Nhập chi tiết nội dung chỉ đạo, biện pháp xử lý hoặc lịch trình khắc phục..."
                multiline
              />

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
