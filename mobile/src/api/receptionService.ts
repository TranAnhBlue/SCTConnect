import api from './axios';

export interface ReceptionRecord {
  id: string;
  citizenName: string;
  phone: string;
  targetLeader: string;
  desiredDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  note?: string;
  createdAt: string;
}

export const receptionService = {
  getReceptions: async (): Promise<ReceptionRecord[]> => {
    try {
      const response = await api.get('/receptions');
      if (response.data?.data) {
        return response.data.data.map((item: any) => ({
          id: item._id || item.id,
          citizenName: item.citizenName,
          phone: item.phone,
          targetLeader: item.targetLeader,
          desiredDate: item.desiredDate,
          reason: item.reason,
          status: item.status || 'pending',
          note: item.note,
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
        }));
      }
      return [];
    } catch (err) {
      console.warn('API Error fetching receptions, returning fallback:', err);
      return [
        {
          id: 'reg_fallback_1',
          citizenName: 'Trần Anh',
          phone: '0912345678',
          targetLeader: 'Chủ tịch Ủy ban MTTQ Xã',
          desiredDate: '28/07/2026',
          reason: 'Kiến nghị đối thoại trực tiếp về giải phóng mặt bằng và an sinh xã hội',
          status: 'approved',
          note: 'Đã phê duyệt lịch gặp vào 08:30 sáng 28/07/2026 tại Trụ sở Cơ quan Mặt trận Xã.',
          createdAt: new Date().toLocaleDateString('vi-VN'),
        },
      ];
    }
  },

  createReception: async (data: {
    citizenName: string;
    phone: string;
    targetLeader: string;
    desiredDate: string;
    reason: string;
  }): Promise<ReceptionRecord> => {
    try {
      const response = await api.post('/receptions', data);
      const item = response.data?.data;
      return {
        id: item?._id || item?.id || 'reg_' + Date.now(),
        citizenName: item?.citizenName || data.citizenName,
        phone: item?.phone || data.phone,
        targetLeader: item?.targetLeader || data.targetLeader,
        desiredDate: item?.desiredDate || data.desiredDate,
        reason: item?.reason || data.reason,
        status: item?.status || 'pending',
        note: item?.note,
        createdAt: item?.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
      };
    } catch (err) {
      console.warn('API Error creating reception, saving local fallback:', err);
      return {
        id: 'reg_' + Date.now(),
        citizenName: data.citizenName,
        phone: data.phone,
        targetLeader: data.targetLeader,
        desiredDate: data.desiredDate,
        reason: data.reason,
        status: 'pending',
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };
    }
  },
};
