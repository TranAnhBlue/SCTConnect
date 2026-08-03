import { Request, Response } from 'express';
import { ServiceModel } from '../models/Service';

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await ServiceModel.find().sort({ isHot: -1 });
    return res.json({ success: true, count: services.length, data: services });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminProcedureReports = async (req: Request, res: Response) => {
  try {
    const adminReports = [
      {
        id: '1',
        title: 'Đơn kiến nghị về chính sách an sinh xã hội & quỹ vì người nghèo',
        code: 'PA-MTTQ-2026-001',
        category: 'an_sinh',
        status: 'done',
        submittedDate: '15/07/2026',
        targetAgency: 'Ủy ban MTTQ Xã Thanh Oai',
        resultDocument: 'Số 45/TB-MTTQ v/v Phê duyệt danh sách hỗ trợ xây nhà Đại đoàn kết',
      },
      {
        id: '2',
        title: 'Đăng ký tham gia Tổ công tác Mặt trận khu dân cư số 3',
        code: 'PA-MTTQ-2026-002',
        category: 'to_chuc',
        status: 'processing',
        submittedDate: '20/07/2026',
        targetAgency: 'Ban Công tác Mặt trận Thôn Thanh Cao',
        resultDocument: 'Đang xem xét trình Thường trực MTTQ Xã phê duyệt',
      },
    ];

    return res.json({ success: true, data: adminReports });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

