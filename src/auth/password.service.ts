import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds = 10;
  constructor(private configService: ConfigService) {}

  async compare(
    password: string,
    hashedPassword?: string | null,
  ): Promise<boolean> {
    if (hashedPassword) {
      return compare(password, hashedPassword);
    }
    return false;
  }

  async generateHash(password: string): Promise<string> {
    return hash(password, this.saltRounds);
  }
}
