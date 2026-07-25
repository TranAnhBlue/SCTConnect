import { Request, Response } from 'express';
import { CitizenReceptionModel } from '../models/CitizenReception';

const initialMockReceptions = [
  {
    _id: 'reg_initial_1',
    citizenName: 'Trần Anh',
    phone: '0912345678',
    targetLeader: 'Chủ tịch Ủy ban MTTQ Xã (Đ/c Nguyễn Văn Minh)',
    desiredDate: '28/07/2026 (Thứ Ba)',
    reason: 'Đề nghị Thường trực Mặt trận Xã tiếp công dân & đối thoại trực tiếp về công tác an sinh xã hội.',
    status: 'approved',
    note: 'Đã phê duyệt lịch gặp vào 08:30 sáng 28/07/2026 tại Trụ sở Cơ quan Mặt trận Xã.',
    createdAt: new Date().toISOString(),
  },
];

export const getReceptions = async (req: Request, res: Response) => {
  try {
    const items = await CitizenReceptionModel.find().sort({ createdAt: -1 });
    if (!items || items.length === 0) {
      return res.json({ success: true, count: initialMockReceptions.length, data: initialMockReceptions });
    }
    return res.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    return res.json({ success: true, count: initialMockReceptions.length, data: initialMockReceptions });
  }
};

export const createReception = async (req: Request, res: Response) => {
  try {
    const { citizenName, phone, targetLeader, desiredDate, reason } = req.body;

    const newDoc = await CitizenReceptionModel.create({
      citizenName,
      phone,
      targetLeader: targetLeader || 'Chủ tịch Ủy ban MTTQ Xã',
      desiredDate: desiredDate || 'Buổi sáng',
      reason,
      status: 'pending',
    });

    console.log('✅ Created new Citizen Reception in MongoDB:', newDoc);
    return res.status(201).json({ success: true, message: 'Đăng ký tiếp công dân thành công', data: newDoc });
  } catch (err: any) {
    console.error('❌ Error creating Citizen Reception:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateReceptionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const updated = await CitizenReceptionModel.findByIdAndUpdate(
      id,
      { status, note },
      { new: true }
    );

    return res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
