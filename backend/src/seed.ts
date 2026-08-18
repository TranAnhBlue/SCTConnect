import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { UserModel } from './models/User';
import { FeedbackModel } from './models/Feedback';
import { PostModel } from './models/Post';
import { NotificationModel } from './models/Notification';
import { MessageModel } from './models/Message';
import { ServiceModel } from './models/Service';
import { CitizenReceptionModel } from './models/CitizenReception';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://trananhblue:TRANANHBLUE@sctconnectdb.ncfhlun.mongodb.net/sctconnect?retryWrites=true&w=majority';

async function seedAllModules() {
  try {
    console.log('Connecting to MongoDB Atlas Cloud...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas!');

    // 1. Clear old collections
    await UserModel.deleteMany({});
    await FeedbackModel.deleteMany({});
    await PostModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await MessageModel.deleteMany({});
    await ServiceModel.deleteMany({});
    await CitizenReceptionModel.deleteMany({});
    console.log('🧹 Cleared all previous collections successfully!');

    // 2. Hash default password
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash('123456', salt);

    // 3. Seed Users (MTTQ Leadership, 5 Member Organizations & Citizen)
    const users = await UserModel.insertMany([
      {
        fullName: 'Đồng chí Nguyễn Văn Minh',
        phone: '0988123456',
        email: 'minh.nguyen@mttq.hanoi.gov.vn',
        passwordHash: defaultHashedPassword,
        role: 'mttq_president',
        organization: 'mttq',
        titleName: 'Chủ tịch Ủy ban MTTQ Xã',
        department: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Lê Hoàng Nam',
        phone: '0988111222',
        email: 'nam.le@doanthanhnien.vn',
        passwordHash: defaultHashedPassword,
        role: 'youth_leader',
        organization: 'youth',
        titleName: 'Phó Chủ tịch MTTQ kiêm Bí thư Đoàn',
        department: 'Đoàn TNCS Hồ Chí Minh Xã Thanh Oai',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Phạm Thị Mai',
        phone: '0988333444',
        email: 'mai.pham@hoiphunu.vn',
        passwordHash: defaultHashedPassword,
        role: 'women_leader',
        organization: 'women',
        titleName: 'Chủ tịch Hội Liên hiệp Phụ nữ Xã',
        department: 'Hội Liên hiệp Phụ nữ Xã Thanh Oai',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Trần Văn Hùng',
        phone: '0988555666',
        email: 'hung.tran@cuuchienbinh.vn',
        passwordHash: defaultHashedPassword,
        role: 'veteran_leader',
        organization: 'veterans',
        titleName: 'Chủ tịch Hội Cựu chiến binh Xã',
        department: 'Hội Cựu chiến binh Xã Thanh Oai',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Nguyễn Văn Nông',
        phone: '0988777888',
        email: 'nong.nguyen@hoinongdan.vn',
        passwordHash: defaultHashedPassword,
        role: 'farmer_leader',
        organization: 'farmers',
        titleName: 'Chủ tịch Hội Nông dân Xã',
        department: 'Hội Nông dân Việt Nam Xã Thanh Oai',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Hoàng Văn Công',
        phone: '0988999000',
        email: 'cong.hoang@congdoan.vn',
        passwordHash: defaultHashedPassword,
        role: 'union_leader',
        organization: 'union',
        titleName: 'Chủ tịch Công đoàn Xã',
        department: 'Công đoàn Cơ quan & Doanh nghiệp Xã Thanh Oai',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
      {
        fullName: 'Trần Anh',
        phone: '0912345678',
        email: 'trananh@citizen.vn',
        passwordHash: defaultHashedPassword,
        role: 'citizen',
        titleName: 'Công dân Xã Thanh Oai',
        department: 'Ủy ban MTTQ & Nhân dân Thôn 2',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
        isVerified: true,
      },
    ]);
    console.log(`✅ Seeded ${users.length} Users with bcrypt hashed passwords.`);

    const citizenUser = users.find((u) => u.phone === '0912345678');
    const mttqPresident = users.find((u) => u.phone === '0988123456');
    const youthLeader = users.find((u) => u.phone === '0988111222');
    const womenLeader = users.find((u) => u.phone === '0988333444');
    const veteranLeader = users.find((u) => u.phone === '0988555666');
    const farmerLeader = users.find((u) => u.phone === '0988777888');
    const unionLeader = users.find((u) => u.phone === '0988999000');

    // 4. Seed Feedbacks with Law Compliant Details (100% Real MTTQ & Commune practices)
    const feedbacks = await FeedbackModel.insertMany([
      {
        reportCode: 'PA-20260818-1001',
        title: 'Giám sát tiến độ và chất lượng thi công tuyến đường liên thôn từ Thôn 1 sang Thôn 2',
        description: 'Đề nghị Ban Giám sát Đầu tư Cộng đồng xã kiểm tra độ dày lớp bê tông và việc đặt cống thoát nước tại đoạn Km 1+200, hiện tại khi mưa lớn nước tràn vào ruộng lúa của bà con.',
        address: 'Đoạn Km 1+200 tuyến đường liên thôn, Thôn 2, Xã Thanh Oai',
        category: 'supervision',
        targetOrganization: 'mttq',
        status: 'done',
        priority: 'urgent',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Ban Giám sát Đầu tư Cộng đồng - Ủy ban MTTQ Xã',
        assignedOfficerId: mttqPresident?._id,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=600&h=400&fit=crop'],
        likes: 56,
        comments: 12,
        satisfactionRating: 5,
        satisfactionComment: 'Ban Giám sát MTTQ đã làm việc ngay với đơn vị thi công để nạo vét và đặt thêm cống thoát nước. Rất cảm ơn các đồng chí!',
        userId: citizenUser?._id,
        reporterName: 'Trần Anh',
        reporterPhone: '0912345678',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Trần Anh (Công dân)',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            note: 'Tiếp nhận phản ánh giám sát thi công hạ tầng giao thông nông thôn',
          },
          {
            status: 'processing',
            changedBy: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Tổ công tác Ban Giám sát cộng đồng phối hợp cán bộ địa chính xã kiểm tra hiện trường',
          },
          {
            status: 'done',
            changedBy: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Đơn vị thi công đã khắc phục xong và ban hành Biên bản nghiệm thu số 48/BB-GSĐTCĐ',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Nguyễn Văn Minh (Chủ tịch Ủy ban MTTQ Xã)',
          department: 'Ban Thường trực Ủy ban MTTQ Việt Nam Xã',
          officialContent: 'Ban Giám sát Đầu tư Cộng đồng đã chủ trì làm việc với Ban QLDA và đơn vị thi công, thống nhất bổ sung 02 cửa cống tiêu thoát nước D600 tại vị trí phản ánh. Đơn vị thi công đã hoàn thành lắp đặt ngày 17/08/2026.',
          documentNumber: 'Số 48/TB-MTTQ',
          responseDate: '17/08/2026 16:30',
          resultImageUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&h=400&fit=crop',
        },
      },
      {
        reportCode: 'PA-20260818-1002',
        title: 'Công khai danh sách và tiến độ giải ngân Quỹ "Vì người nghèo" xây nhà Đại đoàn kết',
        description: 'Kính đề nghị Thường trực Mặt trận Xã thông tin cụ thể về 15 hộ gia đình khó khăn được bình xét hỗ trợ xây sửa nhà Đại đoàn kết đợt 2 năm 2026 để xóm làng cùng chung tay giúp đỡ ngày công.',
        address: 'Thôn Chiến Chiện, Xã Thanh Oai, Hà Nội',
        category: 'welfare',
        targetOrganization: 'mttq',
        status: 'done',
        priority: 'normal',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Ban Vận động Quỹ Vì người nghèo - Ủy ban MTTQ Xã',
        assignedOfficerId: mttqPresident?._id,
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop'],
        likes: 88,
        comments: 15,
        satisfactionRating: 5,
        satisfactionComment: 'Mặt trận công khai minh bạch, cụ thể mức hỗ trợ 50 triệu/nhà. Nhân dân rất phấn khởi và ủng hộ thêm công thợ.',
        userId: citizenUser?._id,
        reporterName: 'Trần Anh',
        reporterPhone: '0912345678',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Trần Anh (Công dân)',
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            note: 'Tiếp nhận kiến nghị công khai danh sách hỗ trợ an sinh xã hội',
          },
          {
            status: 'done',
            changedBy: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Đã niêm yết danh sách tại Nhà văn hóa và đăng tải Thông báo số 52/TB-MTTQ',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Nguyễn Văn Minh (Chủ tịch Ủy ban MTTQ Xã)',
          department: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai',
          officialContent: 'Ủy ban MTTQ Xã đã công khai danh sách 15 hộ nghèo, cận nghèo được phê duyệt hỗ trợ xây nhà Đại đoàn kết (mỗi căn 50.000.000 đồng) trên Cổng thông tin điện tử và hệ thống loa truyền thanh xã.',
          documentNumber: 'Số 52/TB-MTTQ',
          responseDate: '16/08/2026 10:15',
          resultImageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop',
        },
      },
      {
        reportCode: 'PA-20260818-1003',
        title: 'Đề nghị Đoàn Thanh niên hỗ trợ cài đặt định danh điện tử VNeID mức 2 cho người cao tuổi',
        description: 'Nhiều cụ ông cụ bà tại Thôn Cao Dương sử dụng điện thoại thông minh chưa quen và đi lại khó khăn, đề nghị Đoàn Thanh niên xã cử tổ tình nguyện viên đến tận nhà hỗ trợ kích hoạt.',
        address: 'Cụm 3, Thôn Cao Dương, Xã Thanh Oai',
        category: 'youth_field',
        targetOrganization: 'youth',
        status: 'processing',
        priority: 'normal',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Đoàn TNCS Hồ Chí Minh Xã (Khối MTTQ)',
        assignedOfficerId: youthLeader?._id,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop'],
        likes: 112,
        comments: 24,
        userId: citizenUser?._id,
        reporterName: 'Trần Anh',
        reporterPhone: '0912345678',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Trần Anh (Công dân)',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Tiếp nhận đề xuất hỗ trợ chuyển đổi số lưu động',
          },
          {
            status: 'processing',
            changedBy: 'Đ/c Lê Hoàng Nam (Bí thư Đoàn Xã)',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Đoàn Xã đã ra quyết định thành lập 5 Đội Thanh niên xung kích chuyển đổi số',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Lê Hoàng Nam (Bí thư Đoàn Thanh niên Xã)',
          department: 'BTV Đoàn TNCS Hồ Chí Minh Xã Thanh Oai',
          officialContent: 'Đoàn Xã đã ban hành Kế hoạch số 21/KH-ĐTN, phân công 20 đoàn viên phối hợp Công an xã trực tiếp đến các hộ gia đình có người cao tuổi vào Thứ Bảy & Chủ Nhật tuần này.',
          documentNumber: 'Số 21/KH-ĐTN',
          responseDate: '17/08/2026 14:00',
        },
      },
      {
        reportCode: 'PA-20260818-1004',
        title: 'Hội Phụ nữ nhân rộng mô hình "Gia đình 5 không, 3 sạch" và phân loại rác hữu cơ tại nguồn',
        description: 'Khu vực Xóm 4 Thôn Bình Minh có nhu cầu tham gia tập huấn ủ phân hữu cơ vi sinh từ phụ phẩm nông nghiệp và rác thải nhà bếp. Kính đề nghị Hội Phụ nữ xã tổ chức hướng dẫn.',
        address: 'Xóm 4, Thôn Bình Minh, Xã Thanh Oai, Hà Nội',
        category: 'women_field',
        targetOrganization: 'women',
        status: 'done',
        priority: 'normal',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Hội Liên hiệp Phụ nữ Xã (Khối MTTQ)',
        assignedOfficerId: womenLeader?._id,
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop'],
        likes: 64,
        comments: 9,
        satisfactionRating: 5,
        satisfactionComment: 'Lớp tập huấn rất bổ ích, Hội Phụ nữ còn tặng men vi sinh và thùng ủ rác cho các gia đình.',
        reporterName: 'Lê Thị Thu Thủy',
        reporterPhone: '0978123456',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Lê Thị Thu Thủy (Hội viên phụ nữ)',
            changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            note: 'Đề xuất mở lớp tập huấn môi trường xanh',
          },
          {
            status: 'done',
            changedBy: 'Đ/c Phạm Thị Mai (Chủ tịch Hội Phụ nữ Xã)',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Đã tổ chức thành công buổi tập huấn cho 65 hội viên tại Nhà văn hóa Thôn Bình Minh',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Phạm Thị Mai (Chủ tịch Hội LHPN Xã)',
          department: 'Hội Liên hiệp Phụ nữ Xã Thanh Oai',
          officialContent: 'Hội Phụ nữ xã đã phối hợp với Trung tâm Khuyến nông tổ chức lớp chuyển giao kỹ thuật phân loại rác và trao tặng 50 thùng ủ vi sinh cho các chi hội.',
          documentNumber: 'Số 16/BC-PN',
          responseDate: '15/08/2026 11:00',
          resultImageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&h=400&fit=crop',
        },
      },
      {
        reportCode: 'PA-20260818-1005',
        title: 'Tổ Tuần tra Cựu chiến binh duy trì trật tự an ninh và nhắc nhở tiếng ồn đêm khuya',
        description: 'Tại khu vực giáp ranh cụm xóm 2 Thôn Tam Hưng có tình trạng thanh thiếu niên tụ tập rú ga xe máy và hát karaoke loa kéo quá 23h00 gây ảnh hưởng giấc ngủ của người già và trẻ nhỏ.',
        address: 'Khu vực Ngã ba giáp ranh Thôn Tam Hưng, Xã Thanh Oai',
        category: 'veterans_field',
        targetOrganization: 'veterans',
        status: 'done',
        priority: 'urgent',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Hội Cựu chiến binh Xã (Khối MTTQ)',
        assignedOfficerId: veteranLeader?._id,
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop'],
        likes: 95,
        comments: 21,
        satisfactionRating: 5,
        satisfactionComment: 'Tổ Tuần tra CCB phối hợp Công an xã giải quyết rất nhanh và nghiêm minh. Khu dân cư đã yên tĩnh trở lại.',
        reporterName: 'Nguyễn Văn Đạt',
        reporterPhone: '0966778899',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Nguyễn Văn Đạt (Công dân)',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            note: 'Báo tin trật tự an ninh khu dân cư',
          },
          {
            status: 'done',
            changedBy: 'Đ/c Trần Văn Hùng (Chủ tịch Hội CCB Xã)',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Tổ tuần tra đã lập biên bản nhắc nhở và cắm chốt tuần tra ban đêm',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Trần Văn Hùng (Chủ tịch Hội CCB Xã)',
          department: 'Hội Cựu chiến binh Xã Thanh Oai',
          officialContent: 'Tổ Tự quản ANTT Hội CCB đã phối hợp cùng Công an xã tổ chức tuần tra khép kín từ 21h00 - 24h00, ký cam kết không vi phạm với 04 hộ gia đình và giải tán nhóm thanh niên tụ tập.',
          documentNumber: 'Số 09/TB-CCB',
          responseDate: '17/08/2026 08:30',
        },
      },
      {
        reportCode: 'PA-20260818-1006',
        title: 'Hội Nông dân hỗ trợ hướng dẫn thủ tục vay vốn ưu đãi NHCSXH đầu tư máy bay không người lái phun thuốc',
        description: 'Tổ hợp tác sản xuất lúa chất lượng cao Thôn Cự Khê có nhu cầu tiếp cận nguồn vốn Quỹ Hỗ trợ Nông dân và Ngân hàng Chính sách Xã hội để cơ giới hóa nông nghiệp vụ Thu Đông.',
        address: 'Hợp tác xã Nông nghiệp Thôn Cự Khê, Xã Thanh Oai',
        category: 'farmer_field',
        targetOrganization: 'farmers',
        status: 'processing',
        priority: 'normal',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Hội Nông dân Xã (Khối MTTQ)',
        assignedOfficerId: farmerLeader?._id,
        imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&h=400&fit=crop'],
        likes: 73,
        comments: 16,
        reporterName: 'Đặng Đình Tuấn',
        reporterPhone: '0913998877',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Đặng Đình Tuấn (Tổ trưởng THT)',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            note: 'Đề nghị hỗ trợ tiếp cận nguồn vốn tín dụng chính sách',
          },
          {
            status: 'processing',
            changedBy: 'Đ/c Nguyễn Văn Nông (Chủ tịch Hội Nông dân Xã)',
            changedAt: new Date(),
            note: 'Đang thẩm định hồ sơ vay vốn dự án 500 triệu đồng trình NHCSXH huyện',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Nguyễn Văn Nông (Chủ tịch Hội Nông dân Xã)',
          department: 'BCH Hội Nông dân Xã Thanh Oai',
          officialContent: 'Hội Nông dân Xã đã tiếp nhận hồ sơ vay vốn của Tổ hợp tác, hoàn thiện hồ sơ dự án vay 500 triệu đồng từ Quỹ Hỗ trợ Nông dân nguồn Trung ương và dự kiến giải ngân vào ngày 25/08/2026.',
          documentNumber: 'Số 28/TB-HND',
          responseDate: '18/08/2026 09:00',
        },
      },
      {
        reportCode: 'PA-20260818-1007',
        title: 'Công đoàn xã tư vấn bảo vệ quyền lợi hợp đồng lao động và an toàn vệ sinh lao động tại làng nghề',
        description: 'Đề nghị Công đoàn cơ quan phối hợp kiểm tra công tác trang bị bảo hộ lao động và ký kết hợp đồng cho công nhân may mặc tại Cụm tiểu thủ công nghiệp làng nghề Bích Hòa.',
        address: 'Cụm công nghiệp làng nghề Bích Hòa, Xã Thanh Oai',
        category: 'union_field',
        targetOrganization: 'union',
        status: 'done',
        priority: 'normal',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isOverdue: false,
        departmentAssigned: 'Công đoàn Cơ quan Xã (Khối MTTQ)',
        assignedOfficerId: unionLeader?._id,
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
        imageUrls: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop'],
        likes: 51,
        comments: 11,
        satisfactionRating: 5,
        satisfactionComment: 'Công đoàn tư vấn rất nhiệt tình, chủ doanh nghiệp đã trang bị quạt thông gió và khẩu trang than hoạt tính cho công nhân.',
        reporterName: 'Nguyễn Thị Hằng',
        reporterPhone: '0987445566',
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'Nguyễn Thị Hằng (Công nhân)',
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            note: 'Đề nghị tư vấn điều kiện làm việc và hợp đồng lao động',
          },
          {
            status: 'done',
            changedBy: 'Đ/c Hoàng Văn Công (Chủ tịch Công đoàn Xã)',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            note: 'Đoàn công tác đã làm việc với 03 cơ sở và ký cam kết đảm bảo ATVSLĐ',
          },
        ],
        ubndResponse: {
          officerName: 'Đồng chí Hoàng Văn Công (Chủ tịch Công đoàn Xã)',
          department: 'Công đoàn Cơ quan Xã Thanh Oai',
          officialContent: 'Công đoàn Xã đã tổ chức buổi đối thoại giữa chủ cơ sở sản xuất và 85 người lao động, các cơ sở đã đồng thuận tăng mức phụ cấp độc hại và trang bị đầy đủ bảo hộ lao động.',
          documentNumber: 'Số 14/TB-CĐX',
          responseDate: '16/08/2026 15:45',
        },
      },
    ]);
    console.log(`✅ Seeded ${feedbacks.length} Law-compliant Feedback records.`);

    // 5. Seed Citizen Receptions (Real MTTQ Consultation & Dialogue schedules)
    await CitizenReceptionModel.insertMany([
      {
        citizenName: 'Trần Anh',
        phone: '0912345678',
        targetLeader: 'Chủ tịch Ủy ban MTTQ Xã (Đ/c Nguyễn Văn Minh)',
        desiredDate: '25/08/2026 (Sáng Thứ Ba 08:30)',
        reason: 'Đề nghị Thường trực Mặt trận Xã tiếp công dân & đối thoại trực tiếp về công tác đền bù GPMB và phương án bố trí tái định cư dự án đường vành đai.',
        status: 'approved',
        note: 'Đã xếp lịch tiếp công dân lúc 08:30 sáng 25/08/2026 tại Phòng Tiếp công dân - Trụ sở Cơ quan Mặt trận Xã. Kính mời công dân mang theo tài liệu nguồn gốc đất đai liên quan.',
      },
      {
        citizenName: 'Lê Thị Hoa',
        phone: '0977889900',
        targetLeader: 'Bí thư Đoàn Thanh niên Xã (Đ/c Lê Hoàng Nam)',
        desiredDate: '26/08/2026 (Chiều Thứ Tư 14:30)',
        reason: 'Đăng ký tham gia Tổ Công nghệ số cộng đồng và xin hỗ trợ thủ tục hồ sơ vay vốn khởi nghiệp thanh niên nông thôn.',
        status: 'approved',
        note: 'Đã xếp lịch lúc 14:30 chiều 26/08/2026 tại Văn phòng Đoàn Thanh niên - Nhà Văn hóa Xã.',
      },
      {
        citizenName: 'Phạm Thị Lan',
        phone: '0966123789',
        targetLeader: 'Chủ tịch Hội Liên hiệp Phụ nữ Xã (Đ/c Phạm Thị Mai)',
        desiredDate: '27/08/2026 (Sáng Thứ Năm 09:00)',
        reason: 'Hỏi về điều kiện xét duyệt hỗ trợ sinh kế chăn nuôi gà an toàn sinh học cho hội viên phụ nữ nghèo đơn thân.',
        status: 'pending',
      },
      {
        citizenName: 'Bùi Văn Hùng',
        phone: '0983221100',
        targetLeader: 'Chủ tịch Hội Nông dân Xã (Đ/c Nguyễn Văn Nông)',
        desiredDate: '28/08/2026 (Sáng Thứ Sáu 08:30)',
        reason: 'Kiến nghị phối hợp với Công ty Giống cây trồng mở lớp chuyển giao kỹ thuật gieo trồng khoai tây vụ Đông theo chuỗi liên kết tiêu thụ sản phẩm.',
        status: 'pending',
      },
    ]);
    console.log('✅ Seeded Citizen Reception Schedules.');

    // 6. Seed Posts & Citizen Grassroots Polls ("Dân biết - Dân bàn - Dân làm - Dân kiểm tra")
    const posts = await PostModel.insertMany([
      {
        authorName: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai',
        authorRole: 'officer',
        content: '📢 LẤY Ý KIẾN NHÂN DÂN: Dự thảo Phương án Xã hội hóa Lắp đặt Hệ thống Camera An ninh & Đèn chiếu sáng Năng lượng Mặt trời tại các trục đường liên thôn năm 2026.\n\nKính mời toàn thể nhân dân, đoàn viên, hội viên tham gia biểu quyết ý kiến dưới đây:',
        category: 'poll',
        pollOptions: [
          { optionText: 'Phương án 1: Lắp đặt Camera AI an ninh độ nét cao (Xã hỗ trợ 50%, Nhân dân đóng góp 50%)', votesCount: 236 },
          { optionText: 'Phương án 2: Ưu tiên hoàn thành hệ thống Đèn đường năng lượng mặt trời trước (Quý 3/2026)', votesCount: 168 },
          { optionText: 'Phương án 3: Triển khai đồng thời cả 2 hạng mục theo từng cụm dân cư tự quản', votesCount: 94 },
        ],
        likesCount: 215,
        commentsCount: 48,
      },
      {
        authorName: 'Ban Thường vụ Đoàn Thanh niên Xã',
        authorRole: 'officer',
        content: '🌟 PHÁT ĐỘNG PHONG TRÀO: "Ngày Chủ nhật Xanh - Thu gom rác thải nhựa đổi cây xanh" tại tất cả 9 thôn trên địa bàn xã. Hãy cùng tuổi trẻ Thanh Oai chung tay vì môi trường nông thôn sáng - xanh - sạch - đẹp!',
        category: 'discussion',
        imageUrls: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop'],
        likesCount: 178,
        commentsCount: 32,
      },
      {
        authorName: 'Trần Văn Khang (Cựu chiến binh Thôn Tam Hưng)',
        authorRole: 'citizen',
        content: 'Hoan nghênh Thường trực Mặt trận Xã và Ban Giám sát cộng đồng đã kiểm tra, đôn đốc nhà thầu rải bây và đổ bê tông xong tuyến ngõ xóm 2 trước ngày khai giảng năm học mới. Đường phẳng đẹp, các cháu đi học an toàn hơn hẳn!',
        category: 'discussion',
        imageUrls: ['https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&h=400&fit=crop'],
        likesCount: 89,
        commentsCount: 14,
      },
    ]);
    console.log(`✅ Seeded ${posts.length} Community Posts & Citizen Polls.`);

    // 7. Seed Notifications
    const notifications = await NotificationModel.insertMany([
      {
        title: 'Mặt trận Tổ quốc Xã đã ban hành văn bản giải quyết',
        body: 'Kiến nghị "Giám sát chất lượng thi công đường liên thôn" đã được Ban Giám sát MTTQ giải quyết và ban hành Thông báo Số 48/TB-MTTQ.',
        type: 'report_responded',
        isRead: false,
      },
      {
        title: 'Lịch Tiếp công dân của Chủ tịch MTTQ Xã đã được phê duyệt',
        body: 'Phiếu đăng ký tiếp công dân ngày 25/08/2026 của bạn đã được phê duyệt lúc 08:30 sáng tại Trụ sở Mặt trận Xã.',
        type: 'reception_approved',
        isRead: false,
      },
      {
        title: 'Thông báo lịch tiếp công dân định kỳ tuần tới',
        body: 'Thường trực Ủy ban MTTQ Xã và Lãnh đạo 5 đoàn thể thông báo lịch tiếp dân vào sáng Thứ Ba và chiều Thứ Năm hàng tuần tại Trụ sở Cơ quan Mặt trận Xã.',
        type: 'news',
        isRead: true,
      },
    ]);
    console.log(`✅ Seeded ${notifications.length} System Notifications.`);

    // 8. Seed Direct Messages
    const messages = await MessageModel.insertMany([
      {
        senderId: 'citizen_1',
        senderName: 'Trần Anh',
        recipientId: 'officer_1',
        recipientName: 'Đồng chí Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
        text: 'Kính chào đồng chí Chủ tịch MTTQ Xã! Tôi muốn hỏi về thủ tục đăng ký tham gia Tổ hòa giải cơ sở tại Thôn 2 cần gửi đơn về đâu ạ?',
        isRead: true,
      },
      {
        senderId: 'officer_1',
        senderName: 'Đồng chí Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
        recipientId: 'citizen_1',
        recipientName: 'Trần Anh',
        text: 'Chào bác Trần Anh! Thường trực Mặt trận Xã rất hoan nghênh tinh thần tham gia công tác hòa giải cơ sở của bác. Bác có thể gửi phiếu đăng ký trực tiếp trên ứng dụng SCTConnect hoặc nộp cho Trưởng Ban công tác Mặt trận Thôn 2 để Ủy ban MTTQ xã ra quyết định công nhận bác nhé.',
        isRead: false,
      },
    ]);
    console.log(`✅ Seeded ${messages.length} Direct Messages.`);

    // 9. Seed Smart Services
    const services = await ServiceModel.insertMany([
      {
        title: 'Phản ánh Hiện trường',
        description: 'Gửi kiến nghị an sinh, hạ tầng, môi trường tới Mặt trận Tổ quốc Xã',
        iconName: 'camera-plus-outline',
        category: 'public',
        screenRoute: 'FieldReport',
        isHot: true,
      },
      {
        title: 'Đăng ký Tiếp Công dân',
        description: 'Đăng ký lịch hẹn đối thoại trực tiếp với Lãnh đạo Khối Mặt trận',
        iconName: 'account-clock-outline',
        category: 'procedure',
        screenRoute: 'CitizenReception',
        isHot: true,
      },
      {
        title: 'Bản đồ Phản ánh Thực địa',
        description: 'Theo dõi tình hình giải quyết kiến nghị trên 9 thôn toàn xã',
        iconName: 'map-search-outline',
        category: 'map',
        screenRoute: 'FeedbackMap',
        isHot: true,
      },
      {
        title: 'Phản ánh Thủ tục Hành chính',
        description: 'Đóng góp ý kiến chất lượng giải quyết TTHC tại Bộ phận một cửa',
        iconName: 'file-document-edit-outline',
        category: 'procedure',
        screenRoute: 'AdminProcedure',
        isHot: false,
      },
    ]);
    console.log(`✅ Seeded ${services.length} Smart Services.`);

    console.log('\n=============================================================');
    console.log('🎉 TOÀN BỘ CƠ SỞ DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT CHUẨN THỰC TẾ 100%!');
    console.log('=============================================================');
    console.log('🔑 DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP THỰC TẾ:');
    console.log('1. Công dân:          0912345678  / Pass: 123456 (Trần Anh)');
    console.log('2. Chủ tịch MTTQ:     0988123456  / Pass: 123456 (Đ/c Nguyễn Văn Minh)');
    console.log('3. Bí thư Đoàn TN:    0988111222  / Pass: 123456 (Đ/c Lê Hoàng Nam)');
    console.log('4. Hội Phụ nữ:        0988333444  / Pass: 123456 (Đ/c Phạm Thị Mai)');
    console.log('5. Cựu chiến binh:    0988555666  / Pass: 123456 (Đ/c Trần Văn Hùng)');
    console.log('6. Hội Nông dân:      0988777888  / Pass: 123456 (Đ/c Nguyễn Văn Nông)');
    console.log('7. Công đoàn Xã:      0988999000  / Pass: 123456 (Đ/c Hoàng Văn Công)');
    console.log('=============================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed MongoDB Atlas:', error);
    process.exit(1);
  }
}

seedAllModules();
