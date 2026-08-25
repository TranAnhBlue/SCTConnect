import {
  IUser,
  IFeedback,
  IFeedbackStats,
  IDistrictReport,
  IPost,
  ICitizenReception,
  IPublicService,
  INotification,
  IConversation,
  IMessage
} from '../types/api';

export const MOCK_USERS: IUser[] = [
  {
    id: 'u-1',
    fullName: 'Đồng chí Nguyễn Văn Minh',
    phone: '0988123456',
    email: 'minh.nguyen@mttq.hanoi.gov.vn',
    role: 'mttq_president',
    organization: 'mttq',
    titleName: 'Chủ tịch Ủy ban MTTQ Xã',
    department: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai',
    commune: 'Xã Thanh Oai',
    district: 'Huyện Thanh Oai',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    isVerified: true
  },
  {
    id: 'u-2',
    fullName: 'Đồng chí Lê Hoàng Nam',
    phone: '0988111222',
    email: 'nam.le@doanthanhnien.vn',
    role: 'youth_leader',
    organization: 'youth',
    titleName: 'Phó Chủ tịch MTTQ kiêm Bí thư Đoàn',
    department: 'Đoàn TNCS Hồ Chí Minh Xã Thanh Oai',
    commune: 'Xã Thanh Oai',
    district: 'Huyện Thanh Oai',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    isVerified: true
  },
  {
    id: 'u-3',
    fullName: 'Đồng chí Phạm Thị Mai',
    phone: '0988333444',
    email: 'mai.pham@hoiphunu.vn',
    role: 'women_leader',
    organization: 'women',
    titleName: 'Chủ tịch Hội Liên hiệp Phụ nữ Xã',
    department: 'Hội Liên hiệp Phụ nữ Xã Thanh Oai',
    commune: 'Xã Thanh Oai',
    district: 'Huyện Thanh Oai',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    isVerified: true
  },
  {
    id: 'u-4',
    fullName: 'Đồng chí Trần Văn Hùng',
    phone: '0988555666',
    email: 'hung.tran@cuuchienbinh.vn',
    role: 'veteran_leader',
    organization: 'veterans',
    titleName: 'Chủ tịch Hội Cựu chiến binh Xã',
    department: 'Hội Cựu chiến binh Xã Thanh Oai',
    commune: 'Xã Thanh Oai',
    district: 'Huyện Thanh Oai',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    isVerified: true
  },
  {
    id: 'u-citizen',
    fullName: 'Bác Trần Văn An',
    phone: '0912345678',
    email: 'an.tran@gmail.com',
    role: 'citizen',
    titleName: 'Công dân Xã Thanh Oai',
    department: 'Thôn 3, Xã Thanh Oai',
    commune: 'Xã Thanh Oai',
    district: 'Huyện Thanh Oai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    isVerified: true
  }
];

export const MOCK_FEEDBACKS: IFeedback[] = [
  {
    id: 'fb-1',
    reportCode: 'PA-20260814-001',
    title: 'Đề nghị hỗ trợ sửa chữa nhà đại đoàn kết cho hộ bà Nguyễn Thị Lan',
    description: 'Nhà bà Nguyễn Thị Lan thuộc diện hộ nghèo đơn thân tại thôn 2, mái ngói bị dột nặng sau đợt mưa bão vừa qua, tường nứt có nguy cơ sập. Kính đề nghị Ban Vận động Quỹ Vì người nghèo xã và MTTQ xem xét hỗ trợ kinh phí sửa chữa trước mùa mưa lũ.',
    address: 'Thôn 2, Xã Thanh Oai, Huyện Thanh Oai, Hà Nội',
    category: 'welfare',
    targetOrganization: 'mttq',
    departmentAssigned: 'Ban Vận động Quỹ Vì người nghèo MTTQ Xã',
    assignedOfficerName: 'Nguyễn Văn Minh',
    status: 'done',
    priority: 'urgent',
    deadline: '2026-08-20T17:00:00.000Z',
    isOverdue: false,
    statusHistory: [
      {
        status: 'pending',
        changedBy: 'Bác Trần Văn An',
        changedByRole: 'Công dân',
        changedAt: '2026-08-14T08:30:00.000Z',
        note: 'Gửi phản ánh trực tuyến'
      },
      {
        status: 'processing',
        changedBy: 'Đ/c Nguyễn Văn Minh',
        changedByRole: 'Chủ tịch MTTQ Xã',
        changedAt: '2026-08-14T10:15:00.000Z',
        note: 'Đã cử đoàn khảo sát thực tế tình trạng nhà ở hộ bà Lan'
      },
      {
        status: 'done',
        changedBy: 'Đ/c Nguyễn Văn Minh',
        changedByRole: 'Chủ tịch MTTQ Xã',
        changedAt: '2026-08-18T16:00:00.000Z',
        note: 'Đã hoàn thành thi công lợp lại mái tôn xốp và gia cố tường'
      }
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop'
    ],
    gps: { lat: 20.8712, lng: 105.7823 },
    isAnonymous: false,
    reporterName: 'Trần Văn An',
    reporterPhone: '0912345678',
    ubndResponse: {
      officerName: 'Nguyễn Văn Minh',
      department: 'Ủy ban MTTQ Việt Nam Xã Thanh Oai',
      officialContent: 'Ban Thường trực Ủy ban MTTQ xã đã phối hợp với Thôn 2 trích Quỹ Vì người nghèo 30 triệu đồng, kết hợp ngày công tình nguyện của Đoàn Thanh niên để hoàn thành sửa chữa mái nhà cho bà Lan ngày 18/08/2026.',
      documentNumber: '15/TB-MTTQ-TÔ',
      responseDate: '18/08/2026, 16:30',
      resultImageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop'
    },
    satisfactionRating: 5,
    satisfactionComment: 'Cán bộ MTTQ và thanh niên làm việc rất khẩn trương, tận tâm, bà con trong thôn rất hoan nghênh!',
    likes: 24,
    comments: 6,
    createdAt: '2026-08-14T08:30:00.000Z'
  },
  {
    id: 'fb-2',
    reportCode: 'PA-20260815-002',
    title: 'Điểm tập kết rác thải tự phát gây ô nhiễm môi trường gần trường mầm non',
    description: 'Tại đoạn đường dẫn vào trường Mầm non xã Thanh Oai xuất hiện bãi rác tự phát lớn, bốc mùi hôi thối nồng nặc và lấn chiếm lòng đường, ảnh hưởng tới sức khỏe của các cháu học sinh. Đề nghị Đoàn Thanh niên và Hội Phụ nữ tổ chức Ngày Chủ nhật xanh dọn dẹp và đặt biển cấm đổ rác.',
    address: 'Đường liên thôn gần Trường Mầm non Thanh Oai, Huyện Thanh Oai',
    category: 'environment',
    targetOrganization: 'youth',
    departmentAssigned: 'Đoàn Thanh niên Xã phối hợp Hội Phụ nữ',
    assignedOfficerName: 'Lê Hoàng Nam',
    status: 'processing',
    priority: 'urgent',
    deadline: '2026-08-22T17:00:00.000Z',
    isOverdue: false,
    statusHistory: [
      {
        status: 'pending',
        changedBy: 'Chị Hoàng Thảo',
        changedByRole: 'Phụ huynh học sinh',
        changedAt: '2026-08-15T07:45:00.000Z',
        note: 'Gửi phản ánh'
      },
      {
        status: 'processing',
        changedBy: 'Đ/c Lê Hoàng Nam',
        changedByRole: 'Bí thư Đoàn Xã',
        changedAt: '2026-08-15T09:00:00.000Z',
        note: 'Đã lên kế hoạch ra quân Ngày Chủ nhật xanh kết hợp tổ thu gom rác'
      }
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&h=400&fit=crop'
    ],
    gps: { lat: 20.8754, lng: 105.7891 },
    isAnonymous: false,
    reporterName: 'Hoàng Thảo',
    reporterPhone: '0987654321',
    likes: 18,
    comments: 4,
    createdAt: '2026-08-15T07:45:00.000Z'
  },
  {
    id: 'fb-3',
    reportCode: 'PA-20260816-003',
    title: 'Đèn chiếu sáng công cộng tại ngã tư đường trục xã bị chập cháy',
    description: 'Hệ thống 3 bóng đèn cao áp tại ngã tư trục chính xã bị hỏng 4 ngày nay, đường tối tiềm ẩn nguy cơ tai nạn giao thông vào ban đêm. Đề nghị kiểm tra và thay thế sớm.',
    address: 'Ngã tư đường trục chính Xã Thanh Oai, Huyện Thanh Oai',
    category: 'traffic',
    targetOrganization: 'mttq',
    departmentAssigned: 'Tổ Giám sát Đầu tư Cộng đồng MTTQ Xã',
    assignedOfficerName: 'Nguyễn Văn Minh',
    status: 'pending',
    priority: 'normal',
    deadline: '2026-08-25T17:00:00.000Z',
    isOverdue: false,
    statusHistory: [
      {
        status: 'pending',
        changedBy: 'Người dân ẩn danh',
        changedAt: '2026-08-16T19:30:00.000Z',
        note: 'Tiếp nhận phản ánh từ ứng dụng'
      }
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=400&fit=crop'
    ],
    gps: { lat: 20.8698, lng: 105.7765 },
    isAnonymous: true,
    likes: 8,
    comments: 1,
    createdAt: '2026-08-16T19:30:00.000Z'
  },
  {
    id: 'fb-4',
    reportCode: 'PA-20260817-004',
    title: 'Hỗ trợ hội viên phụ nữ vay vốn phát triển mô hình trồng nấm sạch',
    description: 'Chi hội Phụ nữ Thôn 1 có 5 hộ gia đình hội viên mong muốn vay vốn ưu đãi từ Ngân hàng Chính sách Xã hội để mở rộng nhà giàn trồng nấm sò sạch. Đề nghị Hội Phụ nữ xã hướng dẫn làm hồ sơ.',
    address: 'Thôn 1, Xã Thanh Oai, Huyện Thanh Oai',
    category: 'women_field',
    targetOrganization: 'women',
    departmentAssigned: 'Hội Liên hiệp Phụ nữ Xã',
    assignedOfficerName: 'Phạm Thị Mai',
    status: 'processing',
    priority: 'normal',
    deadline: '2026-08-26T17:00:00.000Z',
    isOverdue: false,
    statusHistory: [
      {
        status: 'pending',
        changedBy: 'Bà Nguyễn Thị Bích',
        changedAt: '2026-08-17T09:10:00.000Z',
        note: 'Gửi yêu cầu hỗ trợ'
      },
      {
        status: 'processing',
        changedBy: 'Đ/c Phạm Thị Mai',
        changedAt: '2026-08-17T14:20:00.000Z',
        note: 'Đã liên hệ trực tiếp và hẹn ngày 20/08 xuống thôn phát mẫu tờ khai vay vốn'
      }
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'
    ],
    isAnonymous: false,
    reporterName: 'Nguyễn Thị Bích',
    reporterPhone: '0977112233',
    likes: 12,
    comments: 3,
    createdAt: '2026-08-17T09:10:00.000Z'
  }
];

export const MOCK_STATS: IFeedbackStats = {
  total: 156,
  pending: 18,
  processing: 42,
  done: 92,
  rejected: 4,
  resolutionRate: 94.2,
  satisfactionAvg: 4.8,
  overdueCount: 2,
  byCategory: [
    { category: 'welfare', count: 38, name: 'An sinh xã hội' },
    { category: 'environment', count: 34, name: 'Môi trường - Rác thải' },
    { category: 'traffic', count: 26, name: 'Giao thông - Đô thị' },
    { category: 'supervision', count: 20, name: 'Giám sát đầu tư' },
    { category: 'women_field', count: 15, name: 'Công tác Phụ nữ' },
    { category: 'youth_field', count: 13, name: 'Thanh niên & Khởi nghiệp' },
    { category: 'security', count: 10, name: 'An ninh trật tự' }
  ],
  byOrganization: [
    { org: 'mttq', count: 52, name: 'Ủy ban MTTQ Xã' },
    { org: 'youth', count: 28, name: 'Đoàn Thanh niên' },
    { org: 'women', count: 26, name: 'Hội Phụ nữ' },
    { org: 'veterans', count: 20, name: 'Hội Cựu chiến binh' },
    { org: 'farmers', count: 18, name: 'Hội Nông dân' },
    { org: 'union', count: 12, name: 'Công đoàn cơ sở' }
  ]
};

export const MOCK_DISTRICTS: IDistrictReport[] = [
  { districtName: 'Xã Thanh Oai (Khu Trung tâm)', total: 48, done: 32, pending: 6, processing: 10, lat: 20.872, lng: 105.783 },
  { districtName: 'Thôn 1 & Thôn 2', total: 36, done: 22, pending: 4, processing: 10, lat: 20.865, lng: 105.775 },
  { districtName: 'Thôn 3 & Thôn 4', total: 42, done: 24, pending: 5, processing: 13, lat: 20.881, lng: 105.792 },
  { districtName: 'Khu dân cư Mới & Cụm tiểu thủ công nghiệp', total: 30, done: 14, pending: 3, processing: 9, lat: 20.878, lng: 105.771 }
];

export const MOCK_POSTS: IPost[] = [
  {
    id: 'post-1',
    authorName: 'Ủy ban MTTQ Xã Thanh Oai',
    authorRole: 'Cơ quan chỉ đạo',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    organization: 'mttq',
    title: 'Kế hoạch phát động phong trào Toàn dân đoàn kết xây dựng nông thôn mới nâng cao 2026',
    content: 'Ủy ban MTTQ xã trân trọng thông báo tới toàn thể bà con nhân dân kế hoạch chỉnh trang đường làng ngõ xóm, trồng hoa hai bên đường trục chính và nâng cao các tiêu chí văn hóa nông thôn mới. Kính mời bà con cùng tham gia đóng góp ý kiến.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop'],
    isPinned: true,
    postType: 'announcement',
    likes: 45,
    liked: true,
    commentsCount: 12,
    createdAt: '2026-08-20T08:00:00.000Z'
  },
  {
    id: 'post-2',
    authorName: 'Đoàn TNCS Hồ Chí Minh Xã',
    authorRole: 'Bí thư Đoàn',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    organization: 'youth',
    title: 'Khảo sát ý kiến: Địa điểm xây dựng sân chơi thể thao thanh thiếu nhi năm 2026',
    content: 'Để phục vụ nhu cầu rèn luyện sức khỏe của thanh thiếu nhi và nhân dân, Đoàn xã xin ý kiến biểu quyết của bà con về vị trí ưu tiên đầu tư sân cỏ nhân tạo và xà đơn ngoài trời:',
    images: [],
    isPinned: false,
    postType: 'poll',
    pollOptions: [
      { id: 'opt-1', optionText: 'Khuôn viên Nhà văn hóa Thôn 2', votes: 128 },
      { id: 'opt-2', optionText: 'Sân vận động trung tâm Xã', votes: 245 },
      { id: 'opt-3', optionText: 'Khu đất công giáp Trường Tiểu học', votes: 89 }
    ],
    userVotedOptionId: 'opt-2',
    likes: 82,
    liked: false,
    commentsCount: 28,
    createdAt: '2026-08-22T14:30:00.000Z'
  }
];

export const MOCK_RECEPTIONS: ICitizenReception[] = [
  {
    id: 'rec-1',
    code: 'TD-20260825-01',
    citizenName: 'Bác Vũ Văn Thành',
    citizenPhone: '0982334455',
    citizenIdCard: '001085012345',
    address: 'Thôn 3, Xã Thanh Oai',
    receptionDate: '2026-08-28',
    timeSlot: '08:30 - 09:30',
    topic: 'Kiến nghị phương án bồi thường giải phóng mặt bằng đường Vành đai 4',
    content: 'Gia đình có thắc mắc về đơn giá đền bù đất nông nghiệp và bố trí tái định cư, mong muốn được đối thoại trực tiếp với Chủ tịch MTTQ xã và lãnh đạo UBND.',
    hostLeaderName: 'Đ/c Nguyễn Văn Minh',
    hostLeaderTitle: 'Chủ tịch Ủy ban MTTQ Xã',
    status: 'confirmed',
    note: 'Đã gửi giấy mời và chuẩn bị hồ sơ địa chính liên quan',
    createdAt: '2026-08-24T10:00:00.000Z'
  },
  {
    id: 'rec-2',
    code: 'TD-20260825-02',
    citizenName: 'Bà Đặng Thị Hoa',
    citizenPhone: '0913998877',
    address: 'Thôn 1, Xã Thanh Oai',
    receptionDate: '2026-08-28',
    timeSlot: '09:45 - 10:45',
    topic: 'Thủ tục xin cấp thẻ bảo hiểm y tế cho người cao tuổi trên 75 tuổi',
    content: 'Cần hướng dẫn hồ sơ hưởng trợ cấp và BHYT người cao tuổi theo quy định mới.',
    hostLeaderName: 'Đ/c Phạm Thị Mai',
    hostLeaderTitle: 'Chủ tịch Hội Phụ nữ Xã',
    status: 'pending',
    createdAt: '2026-08-25T08:15:00.000Z'
  }
];

export const MOCK_SERVICES: IPublicService[] = [
  {
    id: 'srv-1',
    name: 'Đăng ký kết hôn trực tuyến',
    code: 'TTHC-X-01',
    category: 'Hộ tịch - Tư pháp',
    department: 'Bộ phận Một cửa UBND Xã',
    processingTimeDays: 1,
    fee: 0,
    description: 'Thủ tục đăng ký kết hôn cho công dân Việt Nam cư trú trên địa bàn xã.',
    requiredDocuments: ['Tờ khai đăng ký kết hôn', 'CCCD gắn chip của hai bên', 'Giấy xác nhận tình trạng hôn nhân'],
    steps: ['Nộp hồ sơ trực tuyến', 'Tiếp nhận và kiểm tra dữ liệu', 'Ký sổ và trao Giấy chứng nhận tại trụ sở'],
    onlineSubmissionAvailable: true
  },
  {
    id: 'srv-2',
    name: 'Xác nhận trợ cấp người có công & hộ nghèo',
    code: 'TTHC-X-02',
    category: 'Lao động - Thương binh & Xã hội',
    department: 'Ban Chính sách Xã hội phối hợp MTTQ Xã',
    processingTimeDays: 3,
    fee: 0,
    description: 'Thủ tục thẩm định và cấp kinh phí hỗ trợ, quà tết cho gia đình chính sách, người có công.',
    requiredDocuments: ['Đơn đề nghị hỗ trợ', 'Bản sao sổ hộ nghèo / Giấy chứng nhận người có công'],
    steps: ['Nộp đơn tại Thôn / Trực tuyến', 'Hội đồng MTTQ thẩm tra', 'UBND ban hành quyết định chi trả'],
    onlineSubmissionAvailable: true
  },
  {
    id: 'srv-3',
    name: 'Xác nhận tình trạng bất động sản & đất đai',
    code: 'TTHC-X-03',
    category: 'Địa chính - Xây dựng',
    department: 'Cán bộ Địa chính - Xây dựng Xã',
    processingTimeDays: 5,
    fee: 50000,
    description: 'Trích lục thông tin nguồn gốc đất đai, xác nhận không có tranh chấp khiếu kiện.',
    requiredDocuments: ['Đơn xin xác nhận nguồn gốc đất', 'Bản photo Giấy chứng nhận QSDĐ', 'Trích đo hiện trạng'],
    steps: ['Nộp hồ sơ', 'Khảo sát thực địa', 'Niêm yết công khai tại UBND xã 15 ngày', 'Cấp giấy xác nhận'],
    onlineSubmissionAvailable: true
  }
];

export const MOCK_NOTIFICATIONS: INotification[] = [
  {
    id: 'notif-1',
    title: 'Phản ánh PA-20260814-001 đã có kết quả xử lý',
    message: 'UBMTTQ Xã Thanh Oai đã hoàn thành hỗ trợ sửa nhà Đại đoàn kết cho hộ bà Nguyễn Thị Lan.',
    type: 'feedback_update',
    isRead: false,
    relatedId: 'fb-1',
    createdAt: '2026-08-18T16:30:00.000Z'
  },
  {
    id: 'notif-2',
    title: 'Lịch tiếp công dân ngày 28/08/2026',
    message: 'Lịch hẹn tiếp dân mã TD-20260825-01 của Bác Vũ Văn Thành đã được Chủ tịch MTTQ xã phê duyệt.',
    type: 'reception_reminder',
    isRead: false,
    relatedId: 'rec-1',
    createdAt: '2026-08-24T10:15:00.000Z'
  },
  {
    id: 'notif-3',
    title: 'Thông báo khảo sát ý kiến xây dựng sân chơi',
    message: 'Đoàn xã vừa mở cuộc khảo sát bình chọn vị trí sân thể thao thanh thiếu nhi.',
    type: 'new_announcement',
    isRead: true,
    relatedId: 'post-2',
    createdAt: '2026-08-22T14:35:00.000Z'
  }
];

export const MOCK_CONVERSATIONS: IConversation[] = [
  {
    id: 'conv-1',
    participantName: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ)',
    participantRole: 'Cán bộ xử lý phản ánh',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    lastMessage: 'MTTQ xã đã nghiệm thu nhà cho bà Lan chiều nay rồi bác nhé!',
    lastMessageTime: '16:45',
    unreadCount: 1,
    relatedReportCode: 'PA-20260814-001'
  },
  {
    id: 'conv-2',
    participantName: 'Đ/c Lê Hoàng Nam (Bí thư Đoàn)',
    participantRole: 'Phụ trách Ngày Chủ nhật xanh',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    lastMessage: 'Chủ nhật này 7h30 đoàn viên sẽ ra quân thu dọn bãi rác ạ.',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
    relatedReportCode: 'PA-20260815-002'
  }
];

export const MOCK_MESSAGES: IMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'u-citizen',
    senderName: 'Bác Trần Văn An',
    senderRole: 'Công dân',
    content: 'Chào đồng chí Minh, phản ánh về nhà bà Lan đã được duyệt hỗ trợ chưa ạ?',
    createdAt: '2026-08-14T09:00:00.000Z'
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'u-1',
    senderName: 'Đồng chí Nguyễn Văn Minh',
    senderRole: 'Chủ tịch MTTQ Xã',
    content: 'Chào bác An, Ban Thường trực MTTQ xã đã họp và trích Quỹ 30 triệu đồng, cuối tuần này triển khai lợp mái ngay cho bà.',
    createdAt: '2026-08-14T10:20:00.000Z'
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'u-1',
    senderName: 'Đồng chí Nguyễn Văn Minh',
    senderRole: 'Chủ tịch MTTQ Xã',
    content: 'MTTQ xã đã nghiệm thu nhà cho bà Lan chiều nay rồi bác nhé!',
    createdAt: '2026-08-18T16:45:00.000Z'
  }
];
