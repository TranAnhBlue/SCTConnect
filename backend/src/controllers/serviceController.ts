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
