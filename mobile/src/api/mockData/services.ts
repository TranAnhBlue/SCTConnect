export interface ServiceItem {
  id: string;
  label: string;
  iconName: string;
  iconFamily: string;
  color: string;
  backgroundColor: string;
  isNew?: boolean;
  screen?: string;
}

export const smartCityServices: ServiceItem[] = [
  {
    id: '1',
    label: 'Phản ánh,\nkiến nghị',
    iconName: 'message-alert',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#D32F2F',
    screen: 'FeedbackMenu',
  },
  {
    id: '2',
    label: 'Đăng ký\ntiếp công dân',
    iconName: 'account-clock',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1565C0',
    screen: 'CitizenReception',
  },
  {
    id: '3',
    label: 'Giám sát\nMặt trận',
    iconName: 'shield-check',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#2E7D32',
    screen: 'FieldReport',
  },
  {
    id: '4',
    label: 'Bản đồ\nthực địa',
    iconName: 'map-marker-radius',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#E65100',
    screen: 'FeedbackMap',
  },
  {
    id: '5',
    label: 'Phản ánh\nTTHC',
    iconName: 'file-document-edit',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#7B1FA2',
    screen: 'AdminProcedure',
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

export const newServices: ServiceItem[] = [
  {
    id: 'n1',
    label: 'Đăng ký Tiếp Dân & Đối thoại',
    iconName: 'account-clock-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1565C0',
    isNew: true,
    screen: 'CitizenReception',
  },
  {
    id: 'n2',
    label: 'Bản đồ Phản ánh Thực địa',
    iconName: 'map-search-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#2E7D32',
    isNew: true,
    screen: 'FeedbackMap',
  },
  {
    id: 'n3',
    label: 'Khối MTTQ & 5 Đoàn thể',
    iconName: 'shield-account',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#D32F2F',
    isNew: true,
    screen: 'FieldReport',
  },
];

export const feedbackMenuItems: ServiceItem[] = [
  {
    id: 'f1',
    label: 'Phản ánh\nan sinh thực địa',
    iconName: 'map-marker',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1565C0',
    screen: 'FieldReport',
  },
  {
    id: 'f2',
    label: 'Phản ánh thủ\ntục hành chính',
    iconName: 'file-document',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#4CAF50',
    screen: 'AdminProcedure',
  },
  {
    id: 'f3',
    label: 'Đăng ký tiếp\ncông dân',
    iconName: 'account-check',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#F9A825',
    screen: 'CitizenReception',
  },
  {
    id: 'f4',
    label: 'Bản đồ thực địa',
    iconName: 'map-search',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#E65100',
    screen: 'FeedbackMap',
  },
];
