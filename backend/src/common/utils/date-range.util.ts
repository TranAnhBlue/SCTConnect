import { BadRequestException } from '@nestjs/common';

export function toStartOfDayIso(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new BadRequestException(
      `Định dạng ngày bắt đầu không hợp lệ: ${dateStr}`,
    );
  }
  if (!dateStr.includes('T')) {
    date.setHours(0, 0, 0, 0);
  }
  return date.toISOString();
}

export function toEndOfDayIso(dateStr?: string | null): string | undefined {
  if (!dateStr) return undefined;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new BadRequestException(
      `Định dạng ngày kết thúc không hợp lệ: ${dateStr}`,
    );
  }
  if (!dateStr.includes('T')) {
    date.setHours(23, 59, 59, 999);
  }
  return date.toISOString();
}
