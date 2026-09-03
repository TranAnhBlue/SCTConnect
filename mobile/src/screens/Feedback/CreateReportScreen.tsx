import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ReportCategory } from '../../types';
import { IVillage, IOrganization, ICategory } from '../../types/api';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../constants';
import { useReportStore } from '../../store/reportStore';
import { useFeedbackStore } from '../../store/feedbackStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { administrativeService } from '../../api/administrativeService';
import { feedbackService } from '../../api/feedbackService';
import { uploadService } from '../../api/uploadService';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'CreateReport'>;
};

type ReportTypeCategory = 'incident' | 'petition' | 'suggestion' | 'environment_order';

const REPORT_TYPES: { key: ReportTypeCategory; label: string; icon: string }[] = [
  { key: 'incident', label: 'Phản ánh sự việc', icon: 'alert-outline' },
  { key: 'petition', label: 'Kiến nghị', icon: 'message-processing-outline' },
  { key: 'suggestion', label: 'Hiến kế', icon: 'lightbulb-outline' },
  { key: 'environment_order', label: 'Môi trường, trật tự', icon: 'leaf-off' },
];

const MEMBER_ORGS = [
  { key: 'farmers', label: 'Hội Nông dân' },
  { key: 'women', label: 'Hội LH Phụ nữ' },
  { key: 'youth', label: 'Đoàn Thanh niên' },
  { key: 'veterans', label: 'Hội Cựu chiến binh' },
  { key: 'elderly', label: 'Hội Người cao tuổi' },
  { key: 'union', label: 'Công đoàn' },
  { key: 'other', label: 'Tổ chức khác' },
  { key: 'none', label: 'Không thuộc tổ chức nào' },
];

const VILLAGES = [
  'Thôn 1, Xã Thanh Oai',
  'Thôn 2, Xã Thanh Oai',
  'Thôn 3, Xã Thanh Oai',
  'Thôn 4, Xã Thanh Oai',
  'Khu Phố Chợ, Xã Thanh Oai',
];

export const CreateReportScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Danh mục từ Backend thật
  const [villagesList, setVillagesList] = useState<IVillage[]>([]);
  const [orgsList, setOrgsList] = useState<IOrganization[]>([]);
  const [categoriesList, setCategoriesList] = useState<ICategory[]>([]);

  // Form State matching UI Mockup
  const [reportType, setReportType] = useState<ReportTypeCategory>('incident');
  const [content, setContent] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  const [showVillagePicker, setShowVillagePicker] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '0912345678');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecordingLive, setIsRecordingLive] = useState(false);
  const [recordingObject, setRecordingObject] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  // Load danh mục động từ Backend khi mở màn hình
  React.useEffect(() => {
    administrativeService.getVillages().then((items) => {
      setVillagesList(items);
      if (items.length > 0) {
        // Mặc định chọn thôn của người dùng hoặc thôn đầu tiên
        const defaultV = items.find((v) => v.id === user?.villageId) || items[0];
        setSelectedVillageId(defaultV.id);
      }
    });

    administrativeService.getOrganizations().then((items) => {
      setOrgsList(items);
      if (items.length > 0) {
        setSelectedOrgId(items[0].id);
      }
    });

    administrativeService.getCategories().then((items) => {
      setCategoriesList(items);
    });
  }, [user]);

  const handleStartVoiceRecord = async () => {
    setShowVoiceModal(true);
    setIsRecordingLive(true);
    setRecordingDuration(0);
    setVoiceTranscript('');

    // 1. Hardware Microphone Recording via expo-av
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.granted) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          (status) => {
            if (status.isRecording) {
              setRecordingDuration(Math.floor(status.durationMillis / 1000));
            }
          },
          200
        );
        setRecordingObject(recording);
      }
    } catch (err) {
      console.warn('Microphone hardware audio recording init:', err);
    }

    // 2. Real-time Speech-to-Text Recognition API (if available)
    const SpeechRecognition =
      (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch (e) {}
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setVoiceTranscript(currentTranscript.trim());
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e: any) {
        console.warn('SpeechRecognition error:', e.message);
      }
    }
  };

  const handleStopVoiceRecord = async () => {
    if (recordingObject) {
      try {
        await recordingObject.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        const uri = recordingObject.getURI();
        setAudioUri(uri);
        setRecordingObject(null);
      } catch (e) {
        console.warn('Stop audio recording error:', e);
      }
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecordingLive(false);
  };

  const handleApplyVoiceText = async (textToApply?: string) => {
    await handleStopVoiceRecord();
    const finalSpeech = textToApply || voiceTranscript || (recordingDuration > 0 ? `[Đoạn âm thanh thu trực tiếp ${recordingDuration} giây]` : 'Đã thu âm phản ánh giọng nói.');
    const cleanText = finalSpeech.replace(/^🗣️\s*/, '');
    setContent((prev) => (prev ? `${prev}\n${cleanText}` : cleanText));
    setShowVoiceModal(false);
  };

  const handlePickImage = () => {
    Alert.alert('Đính kèm ảnh', 'Chọn phương thức:', [
      {
        text: '📷 Chụp ảnh mới',
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
            setSelectedImage(result.assets[0].uri);
          }
        },
      },
      {
        text: '🖼️ Chọn từ thư viện',
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
            setSelectedImage(result.assets[0].uri);
          }
        },
      },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        '🔒 Yêu cầu Đăng nhập',
        'Vui lòng đăng nhập tài khoản để gửi phản ánh & kiến nghị tới Mặt trận Tổ quốc.',
        [
          { text: 'Đăng nhập Ngay', onPress: () => navigation.navigate('Login') },
          { text: 'Đóng', style: 'cancel' },
        ]
      );
      return;
    }

    if (!content.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập nội dung phản ánh hoặc sử dụng tính năng nói.');
      return;
    }

    if (!agreedTerms) {
      Alert.alert('Đồng ý điều khoản', 'Vui lòng tích chọn đồng ý để Ủy ban MTTQ xã xử lý phản ánh.');
      return;
    }

    setSubmitting(true);
    try {
      const typeLabelMap: Record<ReportTypeCategory, string> = {
        incident: 'Phản ánh sự việc',
        petition: 'Kiến nghị',
        suggestion: 'Hiến kế',
        environment_order: 'Môi trường, trật tự',
      };

      const title = `[${typeLabelMap[reportType]}] ${content.trim().slice(0, 50)}...`;

      // Chọn category ID tương ứng hoặc lấy category đầu tiên
      const chosenCategory = categoriesList[0]?.id || 'cat-general';
      const chosenOrg = selectedOrgId || orgsList[0]?.id;
      const chosenVillage = selectedVillageId || villagesList[0]?.id;

      // Upload ảnh lên server qua API /api/v1/uploads/image nếu có
      let uploadedUrls: string[] = [];
      if (selectedImage) {
        try {
          const remoteUrl = await uploadService.uploadImage(selectedImage);
          uploadedUrls.push(remoteUrl);
        } catch (uploadErr) {
          console.warn('Lỗi upload ảnh, tiếp tục gửi nội dung không kèm ảnh:', uploadErr);
        }
      }

      const created = await feedbackService.createFeedback({
        title,
        content: content.trim(),
        targetOrganizationId: chosenOrg,
        incidentVillageId: chosenVillage,
        categoryId: chosenCategory,
        attachments: uploadedUrls,
      });

      setSubmitting(false);

      Alert.alert('Gửi phản ánh thành công!', 'Ý kiến của bạn đã được lưu vào hệ thống và chuyển đến cơ quan có thẩm quyền xử lý.', [
        {
          text: 'Xem danh sách',
          onPress: () => {
            navigation.replace('FieldReport');
          },
        },
      ]);
    } catch (err: any) {
      setSubmitting(false);
      Alert.alert('Gửi thất bại', err.message || 'Không thể gửi phản ánh tới hệ thống');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDF2F4" />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#9C1C24" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Gửi Phản ánh & Kiến nghị</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.content} 
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >

        {/* 1. Header Emblem Banner Card (Matching Mockup pink card) */}
        <View style={styles.bannerCard}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../../assets/logo.png') as any}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bannerTextGroup}>
            <Text style={styles.bannerTitle}>Ủy ban MTTQ Việt Nam xã Thanh Oai</Text>
            <Text style={styles.bannerSub}>Tiếp nhận phản ánh, kiến nghị</Text>
          </View>
        </View>

        {/* 2. Section: Bạn muốn phản ánh việc gì? (4 choice cards 2x2) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bạn muốn phản ánh việc gì?</Text>
          <View style={styles.typeGrid}>
            {REPORT_TYPES.map((type) => {
              const isSelected = reportType === type.key;
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[styles.typeCard, isSelected && styles.typeCardActive]}
                  onPress={() => setReportType(type.key)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={type.icon as any}
                    size={26}
                    color={isSelected ? '#9C1C24' : '#555555'}
                  />
                  <Text style={[styles.typeCardText, isSelected && styles.typeCardTextActive]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Section: Nội dung * */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nội dung <Text style={styles.req}>*</Text></Text>

          <View style={styles.textAreaBox}>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Bạn cứ viết bình thường, không cần đúng văn bản..."
              placeholderTextColor="#999999"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Action Row: Nói thay vì gõ & Ảnh */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleStartVoiceRecord}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="microphone-outline"
                size={20}
                color="#9C1C24"
              />
              <Text style={styles.actionBtnText}>
                Nói thay vì gõ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoBtn} onPress={handlePickImage} activeOpacity={0.8}>
              <MaterialCommunityIcons name="camera-outline" size={20} color="#555555" />
              <Text style={styles.photoBtnText}>
                {selectedImage ? 'Đã đính kèm 📷' : 'Ảnh'}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <View style={styles.previewBox}>
              <Image source={{ uri: selectedImage }} style={styles.previewImg} />
              <TouchableOpacity style={styles.removeImgBtn} onPress={() => setSelectedImage(null)}>
                <MaterialCommunityIcons name="close-circle" size={22} color="#D32F2F" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 4. Section: Tổ chức tiếp nhận phản ánh */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gửi tới Tổ chức / Hội đoàn tiếp nhận <Text style={styles.req}>*</Text></Text>
          <Text style={styles.subNote}>Chọn tổ chức bạn muốn phản ánh hoặc có thẩm quyền giải quyết.</Text>

          <View style={styles.chipWrap}>
            {orgsList.map((org) => {
              const isSelected = selectedOrgId === org.id;
              return (
                <TouchableOpacity
                  key={org.id}
                  style={[styles.orgChip, isSelected && styles.orgChipActive]}
                  onPress={() => setSelectedOrgId(org.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.orgChipText, isSelected && styles.orgChipTextActive]}>
                    {org.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Section: Thôn, xóm * */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa bàn phát sinh (Thôn, xóm) <Text style={styles.req}>*</Text></Text>

          <TouchableOpacity
            style={styles.pickerBox}
            onPress={() => setShowVillagePicker(!showVillagePicker)}
            activeOpacity={0.8}
          >
            <Text style={styles.pickerText}>
              {villagesList.find(v => v.id === selectedVillageId)?.name || 'Chọn Thôn / Tổ dân phố'}
            </Text>
            <MaterialCommunityIcons
              name={showVillagePicker ? 'chevron-up' : 'chevron-down'}
              size={22}
              color="#666666"
            />
          </TouchableOpacity>

          {showVillagePicker && (
            <View style={styles.villageList}>
              {villagesList.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.villageItem, selectedVillageId === v.id && styles.villageItemActive]}
                  onPress={() => {
                    setSelectedVillageId(v.id);
                    setShowVillagePicker(false);
                  }}
                >
                  <Text style={[styles.villageText, selectedVillageId === v.id && styles.villageTextActive]}>
                    {v.name}
                  </Text>
                  {selectedVillageId === v.id && (
                    <MaterialCommunityIcons name="check" size={18} color="#9C1C24" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 6. Section: Số điện thoại */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Số điện thoại</Text>
          <Text style={styles.subNote}>Không bắt buộc. Để lại số nếu bạn muốn được gọi báo kết quả.</Text>

          <TextInput
            style={styles.input}
            placeholder="09xx xxx xxx"
            placeholderTextColor="#999999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* 7. Terms Agreement Checkbox */}
        <TouchableOpacity
          style={styles.termsBox}
          onPress={() => setAgreedTerms(!agreedTerms)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={agreedTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color={agreedTerms ? '#9C1C24' : '#999999'}
          />
          <Text style={styles.termsText}>
            Tôi đồng ý để Ủy ban MTTQ xã sử dụng thông tin trên nhằm xử lý và phản hồi phản ánh này.
          </Text>
        </TouchableOpacity>

        {/* 8. Main Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
          <Text style={styles.submitBtnText}>Gửi phản ánh</Text>
        </TouchableOpacity>

        {/* 9. Footer Hotline */}
        <View style={styles.hotlineFooter}>
          <Text style={styles.hotlineFooterText}>
            Hoặc gọi <Text style={styles.hotlineFooterNum}>0988 123 456</Text> để cán bộ ghi hộ
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Voice Speech-to-Text Recording Modal */}
      <Modal
        visible={showVoiceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.voiceModalOverlay}>
          <View style={styles.voiceModalContainer}>
            <View style={styles.voiceHeader}>
              <View style={[styles.voiceMicCircle, isRecordingLive && styles.voiceMicCircleActive]}>
                <MaterialCommunityIcons name={isRecordingLive ? "microphone" : "microphone-off"} size={36} color={isRecordingLive ? "#D32F2F" : "#777777"} />
              </View>
              <Text style={styles.voiceTitle}>
                {isRecordingLive ? '🎙️ Đang thu âm từ Micro...' : '⏸️ Đã tạm dừng thu âm'}
              </Text>
              <View style={styles.timerBadge}>
                <Text style={styles.timerText}>
                  ⏱️ 00:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}
                </Text>
              </View>
            </View>

            {/* Live Audio Wave Graphic */}
            <View style={styles.waveRow}>
              {[14, 28, 42, 20, 36, 50, 30, 18, 44, 26, 38, 16].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: isRecordingLive ? Math.max(10, (height * (i % 2 === 0 ? 1.2 : 0.8))) : 8 },
                  ]}
                />
              ))}
            </View>

            {/* Live Transcript Display Box */}
            <View style={styles.transcriptBox}>
              <TextInput
                style={styles.transcriptInput}
                placeholder="🔴 Nói vào Micro điện thoại của bạn, chữ sẽ tự động hiện tại đây..."
                placeholderTextColor="#999999"
                value={voiceTranscript}
                onChangeText={setVoiceTranscript}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.voiceActionRow}>
              <TouchableOpacity
                style={styles.voiceCancelBtn}
                onPress={async () => {
                  await handleStopVoiceRecord();
                  setShowVoiceModal(false);
                }}
              >
                <Text style={styles.voiceCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.voiceApplyBtn}
                onPress={() => handleApplyVoiceText()}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                <Text style={styles.voiceApplyText}>Hoàn tất & Dán văn bản ✍️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF9F6' },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDF2F4',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F6E1E4',
  },
  backBtn: { padding: 4 },
  appBarTitle: { fontSize: FontSize.base, fontWeight: '700', color: '#9C1C24' },

  scroll: { flex: 1 },
  content: { padding: Spacing.base, gap: Spacing.lg },

  // Banner Card
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F4',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#F8D7DA',
  },
  logoCircle: {
    width: 64,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F6C4C8',
    padding: 3,
  },
  logoImg: { width: '100%', height: '100%' },
  bannerTextGroup: { flex: 1 },
  bannerTitle: { fontSize: FontSize.base, fontWeight: '800', color: '#9C1C24' },
  bannerSub: { fontSize: FontSize.xs, color: '#666666', marginTop: 2 },

  // Section
  section: { gap: 8 },
  sectionTitle: { fontSize: FontSize.base, fontWeight: '800', color: '#222222' },
  req: { color: '#D32F2F' },
  subNote: { fontSize: FontSize.xs, color: '#777777', marginTop: -4 },

  // 4 Type Grid Cards (2x2)
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  typeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    minHeight: 90,
  },
  typeCardActive: {
    backgroundColor: '#FDF2F4',
    borderColor: '#9C1C24',
  },
  typeCardText: { fontSize: FontSize.xs, fontWeight: '600', color: '#444444', textAlign: 'center' },
  typeCardTextActive: { color: '#9C1C24', fontWeight: '800' },

  // Textarea
  textAreaBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    padding: Spacing.md,
    minHeight: 110,
  },
  textAreaInput: {
    fontSize: FontSize.base,
    color: '#222222',
    lineHeight: 22,
    minHeight: 80,
  },

  // Action Row (Nói thay vì gõ & Ảnh)
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDF2F4',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#9C1C24',
    paddingVertical: 12,
    gap: 6,
  },
  actionBtnRecording: { backgroundColor: '#FFEBEE', borderColor: '#D32F2F' },
  actionBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: '#9C1C24' },
  actionBtnTextRecording: { color: '#D32F2F' },

  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    paddingVertical: 12,
    gap: 6,
  },
  photoBtnText: { fontSize: FontSize.sm, fontWeight: '600', color: '#444444' },

  previewBox: { position: 'relative', marginTop: 8, borderRadius: BorderRadius.md, overflow: 'hidden' },
  previewImg: { width: '100%', height: 160, borderRadius: BorderRadius.md },
  removeImgBtn: { position: 'absolute', top: 8, right: 8 },

  // Org Chips
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  orgChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  orgChipActive: {
    backgroundColor: '#FDF2F4',
    borderColor: '#9C1C24',
  },
  orgChipText: { fontSize: FontSize.xs, color: '#444444', fontWeight: '500' },
  orgChipTextActive: { color: '#9C1C24', fontWeight: '800' },
  otherInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSize.sm,
    marginTop: 6,
  },

  // Picker
  pickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    marginTop: 4,
  },
  pickerText: { fontSize: FontSize.base, color: '#222222', fontWeight: '500' },
  villageList: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    overflow: 'hidden',
    marginTop: 4,
  },
  villageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  villageItemActive: { backgroundColor: '#FDF2F4' },
  villageText: { fontSize: FontSize.base, color: '#333333' },
  villageTextActive: { color: '#9C1C24', fontWeight: '700' },

  // General Input
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.base,
    color: '#222222',
    marginTop: 4,
  },

  // Terms Box
  termsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F9F9F6',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#EAEAE6',
  },
  termsText: { flex: 1, fontSize: FontSize.xs, color: '#555555', lineHeight: 18 },

  // Submit Button
  submitBtn: {
    backgroundColor: '#C62828',
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
    marginTop: 6,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: FontSize.base, fontWeight: '800' },

  // Hotline Footer
  hotlineFooter: { alignItems: 'center', marginTop: 4 },
  hotlineFooterText: { fontSize: FontSize.xs, color: '#666666' },
  hotlineFooterNum: { fontWeight: '800', color: '#9C1C24' },

  // Voice Modal Styles
  voiceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  voiceModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.md,
  },
  voiceHeader: { alignItems: 'center', gap: 6 },
  voiceMicCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  voiceMicCircleActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#D32F2F',
  },
  voiceTitle: { fontSize: FontSize.base, fontWeight: '800', color: '#9C1C24' },
  timerBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: { fontSize: 13, fontWeight: '800', color: '#D32F2F' },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 50,
    backgroundColor: '#FAFAFA',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  waveBar: {
    width: 5,
    backgroundColor: '#D32F2F',
    borderRadius: 3,
  },
  transcriptBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1.5,
    borderColor: '#9C1C24',
    minHeight: 110,
  },
  transcriptInput: { fontSize: FontSize.base, color: '#222222', lineHeight: 22, minHeight: 90 },
  voiceActionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  voiceCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
  },
  voiceCancelText: { fontSize: FontSize.sm, color: '#666666', fontWeight: '600' },
  voiceApplyBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#C62828',
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
  },
  voiceApplyText: { fontSize: FontSize.sm, color: '#FFFFFF', fontWeight: '800' },
});
