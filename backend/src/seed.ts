import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from './models/User';
import { FeedbackModel } from './models/Feedback';
import { PostModel } from './models/Post';
import { NotificationModel } from './models/Notification';
import { MessageModel } from './models/Message';
import { ServiceModel } from './models/Service';

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
    console.log('Cleared all previous collections.');

    // 2. Seed Users (Post-2025 MTTQ & Member Organizations Model)
    const users = await UserModel.insertMany([
      {
        fullName: 'Đồng chí Nguyễn Văn Minh',
        phone: '0988123456',
        email: 'minh.nguyen@mttq.gov.vn',
        role: 'mttq_president',
        department: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Lê Hoàng Nam',
        phone: '0988111222',
        email: 'nam.le@doanthanhnien.vn',
        role: 'youth_leader',
        department: 'Đoàn TNCS Hồ Chí Minh Xã (PCT MTTQ kiêm nhiệm)',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Phạm Thị Mai',
        phone: '0988333444',
        email: 'mai.pham@hoiphunu.vn',
        role: 'women_leader',
        department: 'Hội Liên hiệp Phụ nữ Xã (PCT MTTQ kiêm nhiệm)',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Trần Văn Hùng',
        phone: '0988555666',
        email: 'hung.tran@cuuchienbinh.vn',
        role: 'veteran_leader',
        department: 'Hội Cựu chiến binh Xã (PCT MTTQ kiêm nhiệm)',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Nguyễn Văn Nông',
        phone: '0988777888',
        email: 'nong.nguyen@hoinongdan.vn',
        role: 'farmer_leader',
        department: 'Hội Nông dân Xã (PCT MTTQ kiêm nhiệm)',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Đồng chí Hoàng Văn Công',
        phone: '0988999000',
        email: 'cong.hoang@congdoan.vn',
        role: 'union_leader',
        department: 'Công đoàn / LĐLĐ Xã (PCT MTTQ kiêm nhiệm)',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Trần Anh',
        phone: '0912345678',
        email: 'trananh@citizen.vn',
        role: 'citizen',
        commune: 'Ủy ban MTTQ Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
    ]);
    console.log(`✅ Seeded ${users.length} Users (MTTQ Leadership & Member Org Leaders).`);

    // 3. Seed Feedbacks (MTTQ Supervision, Welfare, Youth, Women, Veterans)
    const feedbacks = await FeedbackModel.insertMany([
      {
        title: 'Kiến nghị Giám sát Công khai ngân sách Quỹ "Vì người nghèo" Quý 2/2026',
        description: 'Đề nghị Ban Thường trực Ủy ban MTTQ Xã minh bạch danh sách các hộ dân được hỗ trợ xây dựng Mái ấm Đại đoàn kết đợt 1.',
        address: 'Thôn 2, xã Thanh Oai, Hà Nội',
        category: 'supervision',
        targetOrganization: 'mttq',
        status: 'done',
        departmentAssigned: 'Ban Thường trực Ủy ban MTTQ Việt Nam Xã',
        imageUrl: 'https://picsum.photos/seed/mttq_welfare/400/250',
        likes: 42,
        comments: 8,
        satisfactionRating: 5,
        ubndResponse: {
          officerName: 'Đồng chí Nguyễn Văn Minh (Chủ tịch Ủy ban MTTQ Xã)',
          department: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
          officialContent: 'Ủy ban MTTQ Xã đã công khai minh bạch toàn bộ 15 hộ nghèo được hỗ trợ nhà Đại đoàn kết trên bảng tin và ứng dụng.',
          documentNumber: 'Số 45/TB-MTTQ',
          responseDate: '24/07/2026 14:30',
          resultImageUrl: 'https://picsum.photos/seed/mttq_proof/400/250',
        },
      },
      {
        title: 'Kiến nghị Đoàn Thanh niên hỗ trợ Chuyển đổi số & VNeID cho người cao tuổi',
        description: 'Đề nghị Đội thanh niên xung kích cấp xã mở điểm hỗ trợ người già hướng dẫn kích hoạt tài khoản định danh điện tử.',
        address: 'Nhà văn hóa thôn Chiến Chiện, xã Thanh Oai',
        category: 'youth_field',
        targetOrganization: 'youth',
        status: 'processing',
        departmentAssigned: 'Đoàn TNCS Hồ Chí Minh Xã (Khối MTTQ)',
        imageUrl: 'https://picsum.photos/seed/youth_app/400/250',
        likes: 85,
        comments: 19,
        ubndResponse: {
          officerName: 'Đồng chí Lê Hoàng Nam (PCT MTTQ kiêm Bí thư Đoàn Xã)',
          department: 'BTV Đoàn Thanh niên Xã Thanh Oai',
          officialContent: 'Đoàn Xã đã thành lập 5 Đội Tình nguyện Chuyển đổi số trực tại các Nhà văn hóa thôn vào thứ 7 và Chủ nhật hàng tuần.',
          documentNumber: 'Số 18/KH-ĐTN',
          responseDate: '25/07/2026 09:00',
        },
      },
      {
        title: 'Đề xuất Hội Phụ nữ nhân rộng mô hình "Gia đình 5 không 3 sạch"',
        description: 'Đề nghị Hội Phụ nữ xã tập huấn phân loại rác thải tại nguồn và tặng thùng rác thân thiện môi trường cho hội viên.',
        address: 'Xóm 4, xã Thanh Oai, Hà Nội',
        category: 'women_field',
        targetOrganization: 'women',
        status: 'pending',
        departmentAssigned: 'Hội Liên hiệp Phụ nữ Xã (Khối MTTQ)',
        imageUrl: 'https://picsum.photos/seed/women_clean/400/250',
        likes: 31,
        comments: 4,
      },
    ]);
    console.log(`✅ Seeded ${feedbacks.length} MTTQ & Member Org Feedback records.`);

    // 4. Seed Posts & Citizen Polls
    const posts = await PostModel.insertMany([
      {
        authorName: 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã Thanh Oai',
        authorRole: 'officer',
        content: '📢 THÔNG BÁO VỀ VIỆC LẤY Ý KIẾN NHÂN DÂN: Kế hoạch mở rộng tuyến đường liên thôn năm 2026. Kính mời bà con nhân dân tham gia bình chọn ý kiến dưới đây.',
        category: 'poll',
        pollOptions: [
          { optionText: 'Đồng ý với phương án 1 (Thực hiện trong Quý 3)', votesCount: 142 },
          { optionText: 'Đồng ý với phương án 2 (Thực hiện trong Quý 4)', votesCount: 85 },
          { optionText: 'Ý kiến đóng góp khác', votesCount: 12 },
        ],
        likesCount: 120,
        commentsCount: 38,
      },
      {
        authorName: 'Nguyễn Văn Hùng',
        authorRole: 'citizen',
        content: 'Cảm ơn Thường trực Mặt trận Xã và các đoàn thể đã kịp thời giám sát và dọn dẹp điểm đen rác thải tại bãi sông! Môi trường khu dân cư đã sạch đẹp hơn rất nhiều.',
        category: 'discussion',
        imageUrls: ['https://picsum.photos/seed/clean/400/250'],
        likesCount: 45,
        commentsCount: 9,
      },
    ]);
    console.log(`✅ Seeded ${posts.length} Community Posts & Citizen Polls.`);

    // 5. Seed Notifications
    const notifications = await NotificationModel.insertMany([
      {
        title: 'Mặt trận Tổ quốc Xã đã ban hành văn bản phản hồi',
        body: 'Phản ánh "Nắp cống hỏng gây nguy hiểm" đã được Thường trực Mặt trận Xã tiếp nhận và ban hành Thông báo Số 89/TB-MTTQ.',
        type: 'ubnd_dispatch',
        isRead: false,
      },
      {
        title: 'Thông báo tiêm chủng mở rộng đợt tháng 7',
        body: 'Trạm Y tế xã Thanh Oai thông báo lịch tiêm chủng cho trẻ em dưới 5 tuổi vào ngày 26/07/2026.',
        type: 'news',
        isRead: true,
      },
    ]);
    console.log(`✅ Seeded ${notifications.length} System & Dispatch Notifications.`);

    // 6. Seed Direct Messages
    const messages = await MessageModel.insertMany([
      {
        senderId: 'citizen_1',
        senderName: 'Trần Anh',
        recipientId: 'officer_1',
        recipientName: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
        text: 'Dạ xin chào Chủ tịch Mặt trận, tôi muốn hỏi về quy trình tham gia giám sát công trình đường liên thôn tại địa phương cần những tài liệu gì ạ?',
        isRead: true,
      },
      {
        senderId: 'officer_1',
        senderName: 'Đ/c Nguyễn Văn Minh (Chủ tịch MTTQ Xã)',
        recipientId: 'citizen_1',
        recipientName: 'Trần Anh',
        text: 'Chào bác Anh! Thường trực Mặt trận Xã rất hoan nghênh tinh thần giám sát cộng đồng của bác. Bác có thể tham gia Ban Giám sát Đầu tư Cộng đồng tại Thôn 2 bác nhé.',
        isRead: false,
      },
    ]);
    console.log(`✅ Seeded ${messages.length} Direct Messages.`);

    // 7. Seed Smart Services
    const services = await ServiceModel.insertMany([
      {
        title: 'Phản ánh hiện trường',
        description: 'Gửi phản ánh an sinh, môi trường, hạ tầng tới Mặt trận Tổ quốc Xã',
        iconName: 'camera-plus-outline',
        category: 'public',
        screenRoute: 'FieldReport',
        isHot: true,
      },
      {
        title: 'Phản ánh Thủ tục Hành chính',
        description: 'Đóng góp ý kiến chất lượng giải quyết TTHC tại Mặt trận Xã',
        iconName: 'file-document-outline',
        category: 'procedure',
        screenRoute: 'AdminProcedure',
        isHot: true,
      },
      {
        title: 'Tổng đài Hà Nội 1022',
        description: 'Đường dây nóng tiếp nhận phản ánh sự cố đô thị 24/7',
        iconName: 'phone-classic',
        category: 'hotline',
        hotline: '1022',
        isHot: true,
      },
      {
        title: 'Bản đồ Phản ánh & Quy hoạch',
        description: 'Tra cứu vị trí sự cố và thông tin quy hoạch địa phương',
        iconName: 'map-search-outline',
        category: 'map',
        screenRoute: 'FeedbackMap',
        isHot: false,
      },
    ]);
    console.log(`✅ Seeded ${services.length} Smart City Services & Hotlines.`);

    console.log('\n🎉 ALL MONGODB ATLAS COLLECTIONS FULLY BUILT & SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed MongoDB Atlas:', error);
    process.exit(1);
  }
}

seedAllModules();
