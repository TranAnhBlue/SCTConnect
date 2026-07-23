import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sctconnect';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn('[MongoDB Warning]: Could not connect to local MongoDB. Running with mock fallback/in-memory mode if DB unavailable.', error);
  }
};
