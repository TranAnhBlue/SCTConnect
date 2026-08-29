import { App } from 'antd';

/**
 * Hook tiện lợi để hiển thị toast message từ Ant Design.
 *
 * Cách dùng:
 * ```tsx
 * const { message } = useMessage();
 * message.success('Thao tác thành công!');
 * message.error('Có lỗi xảy ra!');
 * message.warning('Cảnh báo...');
 * message.info('Thông tin...');
 * message.loading('Đang xử lý...');
 * ```
 */
export const useMessage = () => {
  const { message, notification, modal } = App.useApp();
  return { message, notification, modal };
};
