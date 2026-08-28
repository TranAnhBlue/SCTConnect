import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadsService, UploadedFileDTO } from './services/uploads.service';
import { UploadImageResponseDTO } from './dto/responses/upload-image.response.dto';
import {
  UploadImageResponse,
  UploadImageResponseSchema,
} from './schemas/responses/upload-image.response.schema';
import { UserType } from '../users/entities/user.entity';
import { ApiSuccessResponse, CurrentUser, Roles } from '../common/decorators';

@ApiTags('Tải Tệp Hiện Trường (Uploads)')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Tải ảnh hiện trường lên server (Tối đa 5MB/ảnh, 25MB/ngày/user)',
  })
  @ApiSuccessResponse(
    UploadImageResponseDTO,
    UploadImageResponseSchema,
    'Tải ảnh lên thành công',
  )
  async uploadImage(
    @CurrentUser('id') userId: string,
    @UploadedFile() file?: UploadedFileDTO,
  ): Promise<UploadImageResponse> {
    return this.uploadsService.saveImage(userId, file);
  }

  @Post('cleanup')
  @Roles(UserType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Kích hoạt dọn dẹp các tệp ảnh mồ côi quá 24 giờ (Chỉ dành cho Admin)',
  })
  async triggerCleanup(): Promise<{
    success: boolean;
    deletedCount: number;
    freedBytes: number;
  }> {
    const result = await this.uploadsService.cleanupOrphanedFiles();
    return {
      success: true,
      ...result,
    };
  }
}
