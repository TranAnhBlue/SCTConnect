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
    backgroundColor: '#4CAF50',
    screen: 'FeedbackMenu',
  },
  {
    id: '2',
    label: 'Dịch vụ công',
    iconName: 'domain',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#3F51B5',
    screen: undefined,
  },
  {
    id: '3',
    label: 'Mặt trận Thủ đô',
    iconName: 'star-circle',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#F57F17',
    screen: undefined,
  },
  {
    id: '4',
    label: 'Giao thông',
    iconName: 'traffic-light',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#E53935',
    screen: undefined,
  },
  {
    id: '5',
    label: 'Sổ tay Đảng\nviên điện tử',
    iconName: 'notebook',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#B71C1C',
    screen: undefined,
  },
  {
    id: '6',
    label: 'Tiện ích\nthanh toán',
    iconName: 'credit-card',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#E91E8C',
    screen: undefined,
  },
  {
    id: '7',
    label: 'Xem thêm',
    iconName: 'dots-grid',
    iconFamily: 'MaterialCommunityIcons',
    color: '#9E9E9E',
    backgroundColor: '#F5F5F5',
    screen: undefined,
  },
];

export const newServices: ServiceItem[] = [
  {
    id: 'n1',
    label: 'HanoiGo',
    iconName: 'map-marker-radius',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1565C0',
    isNew: true,
  },
  {
    id: 'n2',
    label: 'Tư vấn An toàn PCCC trong QL sử dụng điện',
    iconName: 'fire-extinguisher',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#C62828',
    isNew: true,
  },
  {
    id: 'n3',
    label: 'BHXH Hà Nội',
    iconName: 'shield-account',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#1B5E20',
    isNew: true,
  },
  {
    id: 'n4',
    label: 'Bản đồ số',
    iconName: 'map',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#2E7D32',
    isNew: true,
  },
];

export const feedbackMenuItems: ServiceItem[] = [
  {
    id: 'f1',
    label: 'Phản ánh\nhiện trường',
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
    label: 'Doanh nghiệp\nkiến nghị',
    iconName: 'domain',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#3F51B5',
    screen: undefined,
  },
  {
    id: 'f5',
    label: 'Bản đồ phản ánh',
    iconName: 'map-search',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFFFFF',
    backgroundColor: '#4CAF50',
    screen: 'FeedbackMap',
  },
];
