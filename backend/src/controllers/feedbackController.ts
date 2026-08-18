import { Request, Response } from 'express';
import { FeedbackModel } from '../models/Feedback';

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { category, search, status, org, userId, isAnonymous } = req.query;
    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (org && org !== 'all') {
      query.targetOrganization = org;
    }
    if (userId) {
      query.userId = userId;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { reportCode: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await FeedbackModel.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message, data: [] });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const item = await FeedbackModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phản ánh' });
    }
    return res.json({ success: true, data: item });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFeedbackByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const item = await FeedbackModel.findOne({ reportCode: code });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phản ánh với mã tra cứu này' });
    }
    return res.json({ success: true, data: item });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      address,
      category,
      targetOrganization,
      departmentAssigned,
      imageUrl,
      imageUrls,
      videoUrl,
      priority,
      gps,
      userId,
      isAnonymous,
      reporterName,
      reporterPhone,
    } = req.body;

    if (!title || !description || !address) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ Tiêu đề, Mô tả và Địa chỉ phản ánh' });
    }

    // Tính deadline pháp lý theo Luật Tiếp công dân: khẩn cấp = 15 ngày, bình thường = 30 ngày
    const daysToAdd = priority === 'urgent' ? 15 : 30;
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + daysToAdd);

    const initialHistory = [
      {
        status: 'pending',
        changedBy: isAnonymous ? 'Công dân (Ẩn danh)' : (reporterName || 'Công dân'),
        changedAt: new Date(),
        note: 'Tiếp nhận phản ánh kiến nghị vào hệ thống',
      },
    ];

    const allImages = imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0
      ? imageUrls
      : (imageUrl ? [imageUrl] : []);

    const newFeedback = await FeedbackModel.create({
      title,
      description,
      address,
      category: category || 'supervision',
      targetOrganization: targetOrganization || 'mttq',
      departmentAssigned: departmentAssigned || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
      imageUrl: allImages[0] || imageUrl,
      imageUrls: allImages,
      videoUrl,
      priority: priority || 'normal',
      deadline: deadlineDate,
      status: 'pending',
      gps,
      userId: userId || undefined,
      isAnonymous: !!isAnonymous,
      reporterName: isAnonymous ? 'Người dân ẩn danh' : reporterName,
      reporterPhone: isAnonymous ? undefined : reporterPhone,
      statusHistory: initialHistory,
    });

    return res.status(201).json({
      success: true,
      message: 'Gửi phản ánh thành công. Mã tiếp nhận: ' + newFeedback.reportCode,
      data: newFeedback,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, changedBy, note, departmentAssigned, assignedOfficerId } = req.body;

    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phản ánh' });
    }

    feedback.status = status || feedback.status;
    if (departmentAssigned) feedback.departmentAssigned = departmentAssigned;
    if (assignedOfficerId) feedback.assignedOfficerId = assignedOfficerId;

    feedback.statusHistory.push({
      status: status || feedback.status,
      changedBy: changedBy || 'Cán bộ xử lý',
      changedAt: new Date(),
      note: note || `Cập nhật trạng thái sang ${status}`,
    });

    await feedback.save();

    return res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: feedback });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUbndResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { officerName, department, officialContent, documentNumber, resultImageUrl } = req.body;

    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phản ánh' });
    }

    feedback.status = 'done';
    feedback.ubndResponse = {
      officerName: officerName || 'Ban Thường trực MTTQ Xã',
      department: department || 'Ủy ban Mặt trận Tổ quốc Việt Nam Xã',
      officialContent,
      documentNumber: documentNumber || 'Số thông báo chính thức',
      responseDate: new Date().toLocaleString('vi-VN'),
      resultImageUrl,
    };

    feedback.statusHistory.push({
      status: 'done',
      changedBy: officerName || 'Cán bộ MTTQ Xã',
      changedAt: new Date(),
      note: 'Đã hoàn thành xử lý và ban hành văn bản trả lời công dân',
    });

    await feedback.save();

    return res.json({ success: true, message: 'Đã ban hành văn bản trả lời của Mặt trận Tổ quốc Xã', data: feedback });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const rateSatisfaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const updated = await FeedbackModel.findByIdAndUpdate(
      id,
      {
        satisfactionRating: Number(rating),
        satisfactionComment: comment || undefined,
      },
      { new: true }
    );

    return res.json({ success: true, message: 'Cảm ơn bà con đã đánh giá chất lượng phục vụ của Mặt trận!', data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getReportStats = async (req: Request, res: Response) => {
  try {
    const items = await FeedbackModel.find();

    const totalReports = items.length;
    const pendingCount = items.filter((i) => i.status === 'pending').length;
    const processingCount = items.filter((i) => i.status === 'processing').length;
    const doneCount = items.filter((i) => i.status === 'done').length;
    const overdueCount = items.filter((i) => i.isOverdue).length;

    const ratedItems = items.filter((i) => i.satisfactionRating && i.satisfactionRating > 0);
    const avgRating = ratedItems.length > 0
      ? Number((ratedItems.reduce((acc, cur) => acc + (cur.satisfactionRating || 5), 0) / ratedItems.length).toFixed(1))
      : 5.0;

    const satisfactionRate = totalReports > 0
      ? Number(((doneCount / totalReports) * 100).toFixed(1))
      : 100;

    return res.json({
      success: true,
      data: {
        totalReports,
        resolvedReports: doneCount,
        processingReports: processingCount,
        pendingReports: pendingCount,
        overdueReports: overdueCount,
        satisfactionRate,
        avgRating,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDistrictMapReports = async (req: Request, res: Response) => {
  try {
    const districtReports = [
      {
        id: '1',
        districtName: 'Thị trấn Kim Bài (Trung tâm Xã)',
        totalCount: 42,
        doneCount: 39,
        processingCount: 3,
        hotline: '024.3386.1022',
        statusColor: '#2E7D32',
      },
      {
        id: '2',
        districtName: 'Thôn Thanh Cao - Thôn Cao Dương',
        totalCount: 31,
        doneCount: 28,
        processingCount: 3,
        hotline: '024.3386.1023',
        statusColor: '#2E7D32',
      },
      {
        id: '3',
        districtName: 'Thôn Bình Minh - Thôn Tam Hưng',
        totalCount: 26,
        doneCount: 22,
        processingCount: 4,
        hotline: '024.3386.1024',
        statusColor: '#F57C00',
      },
      {
        id: '4',
        districtName: 'Thôn Cự Khê - Thôn Bích Hòa',
        totalCount: 19,
        doneCount: 18,
        processingCount: 1,
        hotline: '024.3386.1025',
        statusColor: '#2E7D32',
      },
      {
        id: '5',
        districtName: 'Thôn Mỹ Hưng - Thôn Phương Trung',
        totalCount: 24,
        doneCount: 18,
        processingCount: 6,
        hotline: '024.3386.1026',
        statusColor: '#D32F2F',
      },
    ];

    return res.json({ success: true, data: districtReports });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
