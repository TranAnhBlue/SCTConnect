import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, role, commune, department } = req.body;

    const existing = await UserModel.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Số điện thoại đã được đăng ký' });
    }

    const user = await UserModel.create({
      fullName,
      phone,
      email,
      role: role || 'citizen',
      commune: commune || 'UBND Xã Thanh Oai',
      department,
    });

    return res.status(201).json({ success: true, message: 'Đăng ký thành công', data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    let user = await UserModel.findOne({ phone });
    if (!user) {
      // Create citizen account on first demo login
      user = await UserModel.create({
        fullName: 'Người dân Hà Nội',
        phone,
        role: 'citizen',
        commune: 'UBND Xã Thanh Oai',
        district: 'Huyện Thanh Oai',
      });
    }

    return res.json({
      success: true,
      token: 'demo-jwt-token-sctconnect-2026',
      user,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne();
    return res.json({ success: true, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({ success: true, message: 'Cập nhật thông tin thành công', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
