import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

@Injectable()
export class TokenService {
  private readonly jwtSecret: Uint8Array;
  private readonly jwtRefreshSecret: Uint8Array;

  constructor(private readonly configService: ConfigService) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Biến môi trường JWT_SECRET chưa được cấu hình');
    }

    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!jwtRefreshSecret) {
      throw new Error('Biến môi trường JWT_REFRESH_SECRET chưa được cấu hình');
    }

    this.jwtSecret = new TextEncoder().encode(jwtSecret);
    this.jwtRefreshSecret = new TextEncoder().encode(jwtRefreshSecret);
  }

  async generateTokens(user: {
    id: string;
    phone: string;
    userType: string;
    organizationId?: string | null;
    organizationCode?: string | null;
  }) {
    const now = Math.floor(Date.now() / 1000);

    const accessToken = await new SignJWT({
      sub: user.id,
      phone: user.phone,
      userType: user.userType,
      organizationId: user.organizationId || null,
      organizationCode: user.organizationCode || null,
    })
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT',
      })
      .setIssuedAt(now)
      .setExpirationTime('15m')
      .sign(this.jwtSecret);

    const refreshToken = await new SignJWT({
      sub: user.id,
      tokenType: 'refresh',
    })
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT',
      })
      .setIssuedAt(now)
      .setExpirationTime('30d')
      .sign(this.jwtRefreshSecret);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  async verifyRefreshToken(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwtRefreshSecret, {
        algorithms: ['HS256'],
      });

      return payload;
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwtSecret, {
        algorithms: ['HS256'],
      });

      return payload;
    } catch {
      throw new UnauthorizedException(
        'Access token không hợp lệ hoặc đã hết hạn',
      );
    }
  }
}
