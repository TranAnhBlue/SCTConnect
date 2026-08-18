import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Helper: tạo JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } as jwt.SignOptions
  );
};

// Helper: tạo mã người dùng (loại bỏ passwordHash khỏi response)
const sanitizeUser = (user: any) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  return obj;
};

// POST /auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      fullName, phone, email, password,
      role, organization, titleName, department, commune, district,
    } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }
    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Họ và tên là bắt buộc' });
    }

    const existing = await UserModel.findOne({ phone });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại này đã được đăng ký. Vui lòng quay lại màn hình Đăng nhập!',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : await bcrypt.hash('123456', salt);

    const user = await UserModel.create({
      fullName,
      phone,
      email,
      passwordHash: hashedPassword,
      role: role || 'citizen',
      organization: organization || (role && role !== 'citizen' ? 'mttq' : undefined),
      titleName: titleName || (role && role !== 'citizen' ? 'Cán bộ Mặt trận' : 'Công dân'),
      department: department || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
      commune: commune || 'Xã Thanh Oai',
      district: district || 'Huyện Thanh Oai',
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /auth/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone, password, role, fullName, department, organization, titleName } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }

    let user = await UserModel.findOne({ phone });

    // Nếu chưa có tài khoản → tự động tạo (hỗ trợ demo/seed nhanh)
    if (!user) {
      const isOfficer = role && role !== 'citizen';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || '123456', salt);

      user = await UserModel.create({
        fullName: fullName || (isOfficer ? 'Cán bộ MTTQ' : 'Công dân'),
        phone,
        passwordHash: hashedPassword,
        role: role || 'citizen',
        organization: organization || (isOfficer ? 'mttq' : undefined),
        titleName: titleName || (isOfficer ? 'Lãnh đạo Ủy ban MTTQ Xã' : 'Công dân'),
        department: department || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
        commune: 'Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
        avatarUrl: isOfficer
          ? 'https://picsum.photos/seed/mttq_officer/200/200'
          : 'https://picsum.photos/seed/citizen/200/200',
      });
    } else {
      // Kiểm tra mật khẩu
      if (password && user.passwordHash) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          // Fallback: so sánh plaintext (cho tài khoản cũ chưa hash)
          if (user.passwordHash !== password) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
          }
          // Nếu khớp plaintext → tự động hash lại
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(password, salt);
          await user.save();
        }
      }

      // Cập nhật role nếu đổi
      if (role && user.role !== role) {
        user.role = role;
        if (organization) user.organization = organization;
        if (titleName) user.titleName = titleName;
        if (department) user.department = department;
        if (fullName) user.fullName = fullName;
        await user.save();
      }
    }

    const token = generateToken(user._id.toString());

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /auth/me
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId || userId === 'guest') {
      return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
    }

    const user = await UserModel.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
    }

    return res.json({ success: true, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /auth/profile/:id
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    let updateData: any = { ...rest };

    // Nếu đổi mật khẩu → hash lại
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updated = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
    return res.json({ success: true, message: 'Cập nhật thông tin thành công', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
