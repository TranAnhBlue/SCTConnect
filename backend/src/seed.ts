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

    // 2. Seed Users
    const users = await UserModel.insertMany([
      {
        fullName: 'Nguyễn Văn Minh',
        phone: '0988123456',
        email: 'minh.nguyen@ubnd.gov.vn',
        role: 'officer',
        department: 'Bộ phận Địa chính - Xây dựng & Đô thị',
        commune: 'UBND Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Lê Hoàng Nam',
        phone: '0977888999',
        email: 'nam.le@ubnd.gov.vn',
        role: 'admin',
        department: 'Lãnh đạo UBND Xã',
        commune: 'UBND Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
      {
        fullName: 'Trần Anh',
        phone: '0912345678',
        email: 'trananh@citizen.vn',
        role: 'citizen',
        commune: 'UBND Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        isVerified: true,
      },
    ]);
    console.log(`✅ Seeded ${users.length} Users (Citizens, Officers, Admins).`);

    // 3. Seed Feedbacks
    const feedbacks = await FeedbackModel.insertMany([
      {
        title: 'Nắp cống hỏng gây nguy hiểm cho người đi đường',
        description: 'Nắp cống gãy nứt tại tuyến đường chính khu dân cư gây rủi ro tai nạn giao thông.',
        address: 'Khu đất Dịch vụ 25,2ha Vân Canh, Hoài Đức, Hà Nội',
        category: 'security',
        status: 'processing',
        departmentAssigned: 'Bộ phận Địa chính - Xây dựng & Đô thị UBND Xã',
        imageUrl: 'https://picsum.photos/seed/1/400/250',
        likes: 18,
        comments: 5,
        ubndResponse: {
          officerName: 'Nguyễn Văn Minh',
          department: 'Bộ phận Địa chính - Xây dựng & Đô thị UBND Xã',
          officialContent: 'UBND Xã đã cử Cán bộ Địa chính xuống kiểm tra thực địa. Đã lập biên bản ghi nhận và đúc nắp đan bê tông thay thế.',
          documentNumber: 'Số 89/TB-UBND',
          responseDate: '23/07/2026 10:15',
        },
      },
      {
        title: 'Đề nghị UBND xã xử lý bãi rác tự phát bãi sông',
        description: 'Khu vực sát đường giao thông hình thành bãi rác tự phát gây mất vệ sinh môi trường.',
        address: 'Khu vực Chiến Chiện, xã Thanh Oai, Hà Nội',
        category: 'environment',
        status: 'done',
        departmentAssigned: 'Bộ phận Tài nguyên Môi trường UBND Xã',
        imageUrl: 'https://picsum.photos/seed/3/400/250',
        likes: 62,
        comments: 14,
        satisfactionRating: 5,
        ubndResponse: {
          officerName: 'Lê Hoàng Nam (Phó Chủ tịch UBND Xã)',
          department: 'UBND Xã Thanh Oai',
          officialContent: 'UBND Xã đã huy động lực lượng giải tỏa hoàn toàn bãi rác tự phát và lắp biển Cấm đổ rác cùng camera giám sát.',
          documentNumber: 'Số 102/BC-UBND',
          responseDate: '22/07/2026 16:45',
          resultImageUrl: 'https://picsum.photos/seed/30/400/250',
        },
      },
    ]);
    console.log(`✅ Seeded ${feedbacks.length} Feedback & Response records.`);

    // 4. Seed Posts & Citizen Polls
    const posts = await PostModel.insertMany([
      {
        authorName: 'UBND Xã Thanh Oai',
        authorRole: 'ubnd',
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
        content: 'Cảm ơn UBND Xã và các cán bộ đã kịp thời dọn dẹp điểm đen rác thải tại bãi sông! Môi trường khu dân cư đã sạch đẹp hơn rất nhiều.',
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
        title: 'UBND Xã đã ban hành văn bản phản hồi',
        body: 'Phản ánh "Nắp cống hỏng gây nguy hiểm" đã được UBND Xã tiếp nhận và ban hành Thông báo Số 89/TB-UBND.',
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
        recipientName: 'Cán bộ Nguyễn Văn Minh',
        text: 'Dạ xin chào Cán bộ, tôi muốn hỏi về quy trình làm thủ tục sang tên sổ đỏ tại UBND Xã cần những tài liệu gì ạ?',
        isRead: true,
      },
      {
        senderId: 'officer_1',
        senderName: 'Cán bộ Nguyễn Văn Minh',
        recipientId: 'citizen_1',
        recipientName: 'Trần Anh',
        text: 'Chào bác Anh! Hồ sơ bao gồm: Đơn đăng ký biến động, Giấy chứng nhận quyền sử dụng đất bản gốc, CCCD gắn chip và Hợp đồng chuyển nhượng đã công chứng bác nhé.',
        isRead: false,
      },
    ]);
    console.log(`✅ Seeded ${messages.length} Direct Messages.`);

    // 7. Seed Smart Services
    const services = await ServiceModel.insertMany([
      {
        title: 'Phản ánh hiện trường',
        description: 'Gửi phản ánh an ninh, môi trường, hạ tầng tới UBND Xã',
        iconName: 'camera-plus-outline',
        category: 'public',
        screenRoute: 'FieldReport',
        isHot: true,
      },
      {
        title: 'Phản ánh Thủ tục Hành chính',
        description: 'Đóng góp ý kiến chất lượng giải quyết TTHC tại UBND Xã',
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
