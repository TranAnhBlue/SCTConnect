import { Request, Response } from 'express';
import { FeedbackModel } from '../models/Feedback';

// Initial in-memory seed data in case MongoDB is connecting for the first time
const mockFeedbacks = [
  {
    _id: '1',
    title: 'Nắp cống hỏng gây nguy hiểm',
    description: 'Nắp cống bị hỏng gãy nứt gây mất an toàn giao thông cho người đi đường.',
    address: 'Khu đất Dịch vụ 25,2ha Vân Canh, Hoài Đức, Hà Nội',
    category: 'security',
    status: 'processing',
    departmentAssigned: 'Bộ phận Địa chính - Xây dựng & Đô thị UBND Xã',
    imageUrl: 'https://picsum.photos/seed/1/300/200',
    likes: 15,
    comments: 4,
    ubndResponse: {
      officerName: 'Nguyễn Văn Minh',
      department: 'Bộ phận Địa chính - Xây dựng & Đô thị UBND Xã',
      officialContent: 'UBND Xã đã cử Cán bộ Địa chính xuống kiểm tra thực địa. Đã lập biên bản ghi nhận và đúc nắp đan bê tông thay thế.',
      documentNumber: 'Số 89/TB-UBND',
      responseDate: '23/07/2026 10:15',
    },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Đề nghị UBND xã xử lý bãi rác tự phát',
    description: 'Khu vực sát đường giao thông hình thành bãi rác tự phát gây mất vệ sinh môi trường.',
    address: 'Khu vực Chiến Chiện, xã Thanh Oai, Hà Nội',
    category: 'environment',
    status: 'done',
    departmentAssigned: 'Bộ phận Tài nguyên Môi trường UBND Xã',
    imageUrl: 'https://picsum.photos/seed/3/300/200',
    likes: 54,
    comments: 12,
    satisfactionRating: 5,
    ubndResponse: {
      officerName: 'Lê Hoàng Nam (Phó Chủ tịch UBND Xã)',
      department: 'UBND Xã Thanh Oai',
      officialContent: 'UBND Xã đã huy động lực lượng giải tỏa hoàn toàn bãi rác tự phát và gắn biển Cấm đổ rác.',
      documentNumber: 'Số 102/BC-UBND',
      responseDate: '22/07/2026 16:45',
      resultImageUrl: 'https://picsum.photos/seed/30/300/200',
    },
    createdAt: new Date().toISOString(),
  },
];

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let items = await FeedbackModel.find(query).sort({ createdAt: -1 });

    // Fallback if DB is empty / initializing
    if (!items || items.length === 0) {
      return res.json({ success: true, count: mockFeedbacks.length, data: mockFeedbacks });
    }

    return res.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    return res.json({ success: true, count: mockFeedbacks.length, data: mockFeedbacks });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const item = await FeedbackModel.findById(req.params.id);
    if (!item) {
      const mock = mockFeedbacks.find((m) => m._id === req.params.id) || mockFeedbacks[0];
      return res.json({ success: true, data: mock });
    }
    return res.json({ success: true, data: item });
  } catch (err: any) {
    const mock = mockFeedbacks.find((m) => m._id === req.params.id) || mockFeedbacks[0];
    return res.json({ success: true, data: mock });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { title, description, address, category, departmentAssigned, imageUrl } = req.body;

    const newFeedback = await FeedbackModel.create({
      title,
      description,
      address,
      category: category || 'environment',
      departmentAssigned: departmentAssigned || 'Bộ phận Địa chính - Xây dựng UBND Xã',
      imageUrl,
      status: 'pending',
    });

    return res.status(201).json({ success: true, data: newFeedback });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateUbndResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { officerName, department, officialContent, documentNumber, resultImageUrl } = req.body;

    const updated = await FeedbackModel.findByIdAndUpdate(
      id,
      {
        status: 'done',
        ubndResponse: {
          officerName,
          department,
          officialContent,
          documentNumber,
          responseDate: new Date().toLocaleString('vi-VN'),
          resultImageUrl,
        },
      },
      { new: true }
    );

    return res.json({ success: true, message: 'Đã cập nhật phản hồi của UBND Xã', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const rateSatisfaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const updated = await FeedbackModel.findByIdAndUpdate(
      id,
      { satisfactionRating: Number(rating) },
      { new: true }
    );

    return res.json({ success: true, message: 'Cảm ơn bạn đã đánh giá', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
