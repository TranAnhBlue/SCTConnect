import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { jwtVerify } from 'jose';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: Uint8Array;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('Biến môi trường JWT_SECRET chưa được cấu hình');
    }
    this.jwtSecret = new TextEncoder().encode(secret);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Yêu cầu gửi kèm Bearer Token xác thực');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, this.jwtSecret, {
        algorithms: ['HS256'],
      });

      const userId = payload.sub as string;
      if (!userId) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userId },
        relations: { organization: true },
      });

      if (!user) {
        throw new UnauthorizedException('Tài khoản không tồn tại trên hệ thống');
      }

      if (!user.isActive) {
        throw new UnauthorizedException(
          'Tài khoản của bạn đã bị tạm khóa, vui lòng liên hệ quản trị viên',
        );
      }

      request.user = {
        id: user.id,
        phone: user.phone,
        userType: user.userType,
        organizationId: user.organizationId,
        organizationCode: user.organization?.code || null,
      };

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
