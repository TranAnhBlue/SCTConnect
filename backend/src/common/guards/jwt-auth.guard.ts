import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtVerify } from 'jose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Yêu cầu gửi kèm Bearer Token xác thực');
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(
      this.configService.get<string>('JWT_SECRET', 'default_secret_key_change_me'),
    );

    try {
      const { payload } = await jwtVerify(token, secret);

      request.user = {
        id: payload.sub as string,
        phone: payload.phone as string,
        userType: payload.userType as string,
        permissions: (payload.permissions as string[]) || [],
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
