import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

async function clearEntireDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas Cloud...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas successfully!');

    // Clear all collections to make it 100% blank
    await UserModel.deleteMany({});
    await FeedbackModel.deleteMany({});
    await PostModel.deleteMany({});
    await NotificationModel.deleteMany({});
    await MessageModel.deleteMany({});
    await ServiceModel.deleteMany({});
    await CitizenReceptionModel.deleteMany({});

    console.log('====================================================');
    console.log('✨ ALL DATABASE COLLECTIONS ARE NOW 100% EMPTY & CLEAN!');
    console.log('✨ Không còn bất kỳ dữ liệu mẫu/hardcode nào.');
    console.log('✨ Bạn có thể tự Đăng ký tài khoản và tạo Phản ánh mới để test toàn bộ luồng!');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

clearEntireDatabase();
