import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { UploadImageResponse } from '../schemas/responses/upload-image.response.schema';
import { FeedbackAttachment } from '../../feedbacks/entities/feedback-attachment.entity';

export class UploadedFileDTO {
  originalname!: string;
  mimetype!: string;
  size!: number;
  buffer!: Buffer;
}

interface DetectedImageType {
  ext: string;
  mimeType: string;
}

interface UserUploadTracker {
  timestamps: number[];
  dailyBytes: number;
  dateKey: string;
}

@Injectable()
export class UploadsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadDir: string;
  private readonly appUrl: string;
  private readonly userTrackers = new Map<string, UserUploadTracker>();
  private cleanupTimer?: NodeJS.Timeout;

  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private static readonly MAX_DAILY_BYTES = 25 * 1024 * 1024;
  private static readonly RATE_LIMIT_MAX_REQUESTS = 10;
  private static readonly RATE_LIMIT_WINDOW_MS = 60 * 1000;
  private static readonly CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;
  private static readonly ORPHAN_THRESHOLD_MS = 24 * 60 * 60 * 1000;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    const port = this.configService.get<number>('PORT', 3000);
    this.appUrl = this.configService.get<string>(
      'APP_URL',
      `http://localhost:${port}`,
    );
  }

  onModuleInit(): void {
    this.cleanupOrphanedFiles().catch((err) => {
      this.logger.error(`Initial orphan cleanup failed: ${err.message}`);
    });

    this.cleanupTimer = setInterval(() => {
      this.cleanupOrphanedFiles().catch((err) => {
        this.logger.error(`Scheduled orphan cleanup failed: ${err.message}`);
      });
    }, UploadsService.CLEANUP_INTERVAL_MS);
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }

  async cleanupOrphanedFiles(
    maxAgeMs = UploadsService.ORPHAN_THRESHOLD_MS,
  ): Promise<{ deletedCount: number; freedBytes: number }> {
    let deletedCount = 0;
    let freedBytes = 0;

    try {
      const files = await fs.promises.readdir(this.uploadDir);
      if (files.length === 0) {
        return { deletedCount: 0, freedBytes: 0 };
      }

      const activeAttachments = await this.dataSource
        .getRepository(FeedbackAttachment)
        .find({ select: { fileUrl: true } });

      const activeFileNames = new Set(
        activeAttachments.map((att) => path.basename(att.fileUrl)),
      );

      const now = Date.now();

      for (const fileName of files) {
        const filePath = path.join(this.uploadDir, fileName);

        try {
          const stat = await fs.promises.stat(filePath);
          if (!stat.isFile()) continue;

          const ageMs = now - stat.mtimeMs;

          if (ageMs > maxAgeMs && !activeFileNames.has(fileName)) {
            await fs.promises.unlink(filePath);
            deletedCount++;
            freedBytes += stat.size;
            this.logger.log(
              `Đã dọn dẹp file mồ côi: ${fileName} (${(stat.size / 1024).toFixed(1)} KB)`,
            );
          }
        } catch {
          continue;
        }
      }
    } catch (err: any) {
      this.logger.error(`Lỗi dọn dẹp file mồ côi: ${err?.message}`);
    }

    return { deletedCount, freedBytes };
  }

  private getOrCreateTracker(userId: string): UserUploadTracker {
    const today = new Date().toISOString().slice(0, 10);
    let tracker = this.userTrackers.get(userId);

    if (!tracker || tracker.dateKey !== today) {
      tracker = {
        timestamps: [],
        dailyBytes: 0,
        dateKey: today,
      };
      this.userTrackers.set(userId, tracker);
    }

    return tracker;
  }

  private checkRateLimitAndQuotaPreCheck(
    userId: string,
    fileSize: number,
  ): void {
    if (fileSize > UploadsService.MAX_FILE_SIZE) {
      throw new BadRequestException(
        'Kích thước tệp ảnh tối đa cho phép là 5MB',
      );
    }

    const now = Date.now();
    const tracker = this.getOrCreateTracker(userId);

    tracker.timestamps = tracker.timestamps.filter(
      (ts) => now - ts < UploadsService.RATE_LIMIT_WINDOW_MS,
    );

    if (tracker.timestamps.length >= UploadsService.RATE_LIMIT_MAX_REQUESTS) {
      throw new HttpException(
        'Bạn thao tác tải ảnh quá nhanh, vui lòng chờ 1 phút trước khi tiếp tục',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (tracker.dailyBytes + fileSize > UploadsService.MAX_DAILY_BYTES) {
      throw new HttpException(
        'Bạn đã vượt quá giới hạn dung lượng tải ảnh trong ngày (tối đa 25MB/ngày). Vui lòng thử lại vào ngày mai',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private recordSuccessfulUpload(userId: string, fileSize: number): void {
    const tracker = this.getOrCreateTracker(userId);
    tracker.timestamps.push(Date.now());
    tracker.dailyBytes += fileSize;
  }

  async saveImage(
    userId: string,
    file?: UploadedFileDTO,
  ): Promise<UploadImageResponse> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Vui lòng chọn tệp ảnh để tải lên');
    }

    this.checkRateLimitAndQuotaPreCheck(userId, file.size);

    const detected = this.detectImageMagicBytes(file.buffer);
    if (!detected) {
      throw new BadRequestException(
        'Định dạng ảnh không được hỗ trợ hoặc tệp không hợp lệ (chỉ chấp nhận JPEG, PNG, WEBP, HEIC)',
      );
    }

    if (detected.mimeType !== file.mimetype) {
      this.logger.warn(
        `Mimetype mismatch: client khai báo "${file.mimetype}" nhưng nội dung thực tế là "${detected.mimeType}" (originalname: ${file.originalname})`,
      );
    }

    const fileName = `${randomUUID()}${detected.ext}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    this.recordSuccessfulUpload(userId, file.size);

    const fileUrl = `${this.appUrl.replace(/\/$/, '')}/uploads/${fileName}`;

    return {
      fileUrl,
      fileName,
      fileSize: file.size,
      mimeType: detected.mimeType,
    };
  }

  private matchesSignature(
    buffer: Buffer,
    signature: number[],
    offset = 0,
  ): boolean {
    return signature.every((byte, i) => buffer[offset + i] === byte);
  }

  private detectImageMagicBytes(buffer: Buffer): DetectedImageType | null {
    if (!buffer || buffer.length < 12) {
      return null;
    }

    if (this.matchesSignature(buffer, [0xff, 0xd8, 0xff])) {
      return { ext: '.jpg', mimeType: 'image/jpeg' };
    }

    if (
      this.matchesSignature(
        buffer,
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      )
    ) {
      return { ext: '.png', mimeType: 'image/png' };
    }

    if (
      this.matchesSignature(buffer, [0x52, 0x49, 0x46, 0x46]) &&
      this.matchesSignature(buffer, [0x57, 0x45, 0x42, 0x50], 8)
    ) {
      return { ext: '.webp', mimeType: 'image/webp' };
    }

    const ftyp = buffer.subarray(4, 12).toString('ascii');
    const heicBrands = ['heic', 'heix', 'hevc', 'mif1', 'msf1'];
    if (heicBrands.some((brand) => ftyp.includes(brand))) {
      return { ext: '.heic', mimeType: 'image/heic' };
    }

    return null;
  }
}
