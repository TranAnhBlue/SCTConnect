import apiClient from './axios';

export interface IUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export const uploadService = {
  // Tải ảnh hiện trường lên server (/api/v1/uploads/image)
  async uploadImage(uri: string): Promise<string> {
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);

      const res = await apiClient.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data: IUploadResponse = res.data?.data || res.data;
      return data.fileUrl;
    } catch (e) {
      console.warn('API uploadImage failed', e);
      throw e;
    }
  },
};
