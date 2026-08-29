import apiClient from './api';
import { IUploadImageResponse } from '../types/api';

export const uploadService = {
  async uploadImage(file: File): Promise<IUploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data?.data || res.data;
  }
};
