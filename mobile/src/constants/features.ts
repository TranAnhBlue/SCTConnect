export interface AppFeatureItem {
  id: string;
  label: string;
  iconName: string;
  iconFamily: string;
  color: string;
  backgroundColor: string;
  screen?: string;
  isNew?: boolean;
}

// Danh mục các tính năng / phân hệ của ứng dụng
export const appFeatures: AppFeatureItem[] = [
  {
    id: '1',
    label: 'Gửi phản ánh\nkiến nghị',
    iconName: 'message-alert',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#D32F2F',
    screen: 'CreateReport',
  },
  {
    id: '2',
    label: 'Danh sách\nphản ánh',
    iconName: 'format-list-bulleted',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#2E7D32',
    screen: 'FieldReport',
  },
  {
    id: '3',
    label: 'Bản đồ\nthực địa',
    iconName: 'map-marker-radius',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#E65100',
    screen: 'FeedbackMap',
  },
  {
    id: '4',
    label: 'Phản ánh\nTTHC',
    iconName: 'file-document-edit',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#7B1FA2',
    screen: 'AdminProcedure',
  },
  {
    id: '5',
    label: 'Đăng ký\ntiếp công dân',
    iconName: 'account-clock',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1565C0',
    screen: 'CitizenReception',
  },
  {
    id: '6',
    label: 'Ý kiến\n& Biểu quyết',
    iconName: 'vote-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#C2185B',
    screen: 'Community',
  },
];

export const feedbackMenuFeatures: AppFeatureItem[] = [
  {
    id: 'f1',
    label: 'Gửi phản ánh\nmới',
    iconName: 'plus-circle-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#D32F2F',
    screen: 'CreateReport',
  },
  {
    id: 'f2',
    label: 'Danh sách\nphản ánh',
    iconName: 'format-list-checks',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1565C0',
    screen: 'FieldReport',
  },
  {
    id: 'f3',
    label: 'Phản ánh\nthủ tục HC',
    iconName: 'file-document',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#4CAF50',
    screen: 'AdminProcedure',
  },
  {
    id: 'f4',
    label: 'Bản đồ\nthực địa',
    iconName: 'map-search',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#E65100',
    screen: 'FeedbackMap',
  },
];
