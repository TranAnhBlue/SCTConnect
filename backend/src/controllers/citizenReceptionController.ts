import { Request, Response } from 'express';
import { CitizenReceptionModel } from '../models/CitizenReception';

export const getReceptions = async (req: Request, res: Response) => {
  try {
    const items = await CitizenReceptionModel.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message, data: [] });
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

    return res.status(201).json({ success: true, message: 'Đăng ký tiếp công dân thành công', data: newDoc });
  } catch (err: any) {
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
