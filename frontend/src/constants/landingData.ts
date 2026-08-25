import {
  ProblemItem,
  FeatureItem,
  BenefitItem,
  ProcessStep,
  TrackingStep,
  AudienceItem,
  GetStartedStep,
  StatItem
} from '../types';

export const PROBLEMS_DATA: ProblemItem[] = [
  {
    num: "01",
    title: "Ghi chép bằng sổ dễ quên, dễ mất",
    description: "Thông tin phản ánh lưu rải rác, khó tra cứu lại khi cần và dễ thất lạc số liệu."
  },
  {
    num: "02",
    title: "Không rõ phản ánh đang ở khâu nào",
    description: "Người dân không biết ý kiến của mình đã được chuyển cho ai, bao giờ có câu trả lời."
  },
  {
    num: "03",
    title: "Báo cáo, thống kê làm thủ công",
    description: "Cuối tháng, cuối quý cán bộ phải cộng sổ từng trang, mất nhiều thời gian và dễ sai sót."
  },
  {
    num: "04",
    title: "Phối hợp với đoàn thể còn rời rạc",
    description: "Chưa có kênh liên thông để MTTQ và các tổ chức thành viên cùng theo dõi một việc."
  }
];

export const FEATURES_DATA: FeatureItem[] = [
  {
    glyph: "📝",
    title: "Gửi phản ánh trực tuyến",
    description: "Người dân gửi ý kiến, kiến nghị kèm ảnh và vị trí thực tế ngay trên điện thoại."
  },
  {
    glyph: "🗂️",
    title: "Phân loại & phân công xử lý",
    description: "Cán bộ tiếp nhận, phân loại và phân công đúng người phụ trách trên cùng một màn hình."
  },
  {
    glyph: "📍",
    title: "Theo dõi tiến độ thời gian thực",
    description: "Người dân và cán bộ đều thấy rõ trạng thái xử lý, nhận thông báo khi có cập nhật."
  },
  {
    glyph: "📊",
    title: "Báo cáo, thống kê tự động",
    description: "Tổng hợp số liệu theo lĩnh vực và địa bàn, không cần cộng sổ thủ công cuối tháng."
  },
  {
    glyph: "🤝",
    title: "Phối hợp tổ chức thành viên",
    description: "Kết nối MTTQ với Đoàn Thanh niên, Hội Phụ nữ, Hội Cựu chiến binh… trên cùng dữ liệu."
  },
  {
    glyph: "🛠️",
    title: "Hỗ trợ tận tình",
    description: "Đội ngũ SCT hướng dẫn từng bước, có tài liệu dễ hiểu, hỗ trợ nhanh khi cần."
  }
];

export const BENEFITS_DATA: BenefitItem[] = [
  {
    glyph: "👍",
    title: "Dễ dùng — ai cũng làm được",
    description: "Giao diện thân thiện, thao tác đơn giản, không cần rành công nghệ."
  },
  {
    glyph: "⏱️",
    title: "Tiết kiệm thời gian xử lý",
    description: "Không cần ghi sổ dài dòng, chọn mục có sẵn và cập nhật nhanh gọn."
  },
  {
    glyph: "👁️",
    title: "Minh bạch với người dân",
    description: "Người dân thấy rõ tiến độ xử lý, không còn gửi đi rồi chờ trong im lặng."
  },
  {
    glyph: "🔗",
    title: "Phối hợp hiệu quả hơn",
    description: "MTTQ và các đoàn thể cùng làm việc trên một nguồn dữ liệu thống nhất."
  },
  {
    glyph: "📈",
    title: "Báo cáo chính xác, kịp thời",
    description: "Số liệu tổng hợp tự động, phục vụ tốt công tác chỉ đạo điều hành."
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Mở app trên điện thoại",
    description: "Chạm vào biểu tượng app, giao diện hiện ra rõ ràng với các mục sắp xếp ngăn nắp."
  },
  {
    step: "02",
    title: "Chọn phản ánh cần xử lý",
    description: "Chọn nội dung từ danh sách, phân loại theo lĩnh vực, không cần gõ chữ nhiều."
  },
  {
    step: "03",
    title: "Cập nhật và lưu lại",
    description: "Bấm lưu là xong. Dữ liệu tự động cập nhật, đồng bộ lên hệ thống chung."
  }
];

export const TRACKING_STEPS: TrackingStep[] = [
  {
    step: 1,
    title: "Đã gửi phản ánh",
    description: "Người dân gửi nội dung kèm ảnh và vị trí thực tế.",
    done: true
  },
  {
    step: 2,
    title: "Đã tiếp nhận",
    description: "Cán bộ MTTQ xã tiếp nhận và phân loại theo lĩnh vực.",
    done: true
  },
  {
    step: 3,
    title: "Đang xử lý",
    description: "Chuyển đến đơn vị phụ trách hoặc phối hợp tổ chức thành viên.",
    done: false
  },
  {
    step: 4,
    title: "Phản hồi kết quả",
    description: "Người dân nhận thông báo kết quả ngay trên ứng dụng.",
    done: false
  }
];

export const AUDIENCE_DATA: AudienceItem[] = [
  {
    glyph: "👤",
    title: "Người dân",
    description: "Gửi ý kiến, kiến nghị và theo dõi kết quả xử lý mọi lúc, mọi nơi."
  },
  {
    glyph: "🏛️",
    title: "Cán bộ MTTQ xã",
    description: "Tiếp nhận, phân loại, phân công và báo cáo tập trung trên một nền tảng."
  },
  {
    glyph: "🚩",
    title: "Tổ chức thành viên",
    description: "Đoàn Thanh niên, Hội Phụ nữ, Hội Cựu chiến binh… phối hợp xử lý theo lĩnh vực."
  },
  {
    glyph: "📋",
    title: "Lãnh đạo địa phương",
    description: "Theo dõi số liệu tổng hợp, phục vụ công tác chỉ đạo và điều hành kịp thời."
  }
];

export const GET_STARTED_STEPS: GetStartedStep[] = [
  {
    step: 1,
    title: "Đăng ký tài khoản",
    description: "Điền thông tin cơ bản của đơn vị, xác nhận và kích hoạt tài khoản ngay."
  },
  {
    step: 2,
    title: "Bắt đầu tiếp nhận & xử lý",
    description: "Mở app và bắt đầu tiếp nhận phản ánh hàng ngày, dữ liệu lưu trữ an toàn."
  },
  {
    step: 3,
    title: "Được hướng dẫn sử dụng",
    description: "Nhận video hướng dẫn chi tiết, đội ngũ hỗ trợ sẵn sàng đồng hành từng bước."
  },
  {
    step: 4,
    title: "Theo dõi báo cáo tổng hợp",
    description: "Xem số liệu, thống kê theo lĩnh vực và địa bàn phục vụ công tác quản lý."
  }
];

export const STATS_DATA: StatItem[] = [
  {
    num: "4",
    label: "nhóm chức năng cốt lõi"
  },
  {
    num: "3",
    label: "đối tượng sử dụng: dân · cán bộ · đoàn thể"
  },
  {
    num: "1",
    label: "nền tảng dữ liệu duy nhất"
  }
];
