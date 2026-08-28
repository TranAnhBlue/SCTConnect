import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
    });
  }

  async verify(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return argon2.verify(passwordHash, plainPassword);
  }

  async verifyOrThrow(
    plainPassword: string,
    passwordHash: string,
    errorMessage = 'Số điện thoại hoặc mật khẩu không chính xác',
  ): Promise<void> {
    const isValid = await this.verify(plainPassword, passwordHash);
    if (!isValid) {
      throw new UnauthorizedException(errorMessage);
    }
  }
}
