import { Request, Response } from 'express';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { imageBase64, fileName } = req.body;

    // Simulate processing image upload & returning hosted asset URL
    const demoUploadedUrl = imageBase64
      ? `data:image/jpeg;base64,${imageBase64.substring(0, 50)}...`
      : `https://picsum.photos/seed/${Date.now()}/600/400`;

    return res.json({
      success: true,
      message: 'Tải ảnh đính kèm thành công',
      data: {
        url: demoUploadedUrl,
        fileName: fileName || `photo_${Date.now()}.jpg`,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
