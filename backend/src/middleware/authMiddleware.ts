import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Không có token → guest
      req.user = { id: 'guest', role: 'citizen', fullName: 'Khách' };
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }

    const jwtSecret = process.env.JWT_SECRET!;

    // Verify JWT thật
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtErr: any) {
      // Fallback: hỗ trợ token cũ dạng sct_token_<userId> trong thời gian chuyển đổi
      if (token.startsWith('sct_token_')) {
        const userId = token.replace('sct_token_', '').replace('fallback_', '');
        if (userId.match(/^[0-9a-fA-F]{24}$/)) {
          const user = await UserModel.findById(userId).select('-passwordHash');
          req.user = user || { id: userId, role: 'citizen' };
          return next();
        }
      }
      return res.status(401).json({ success: false, message: 'Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.' });
    }

    const user = await UserModel.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: 'Xác thực tài khoản thất bại' });
  }
};

// Middleware kiểm tra quyền officer/admin
export const requireOfficer = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (!role || role === 'citizen') {
    return res.status(403).json({ success: false, message: 'Chỉ Cán bộ MTTQ mới có quyền thực hiện thao tác này' });
  }
  next();
};
