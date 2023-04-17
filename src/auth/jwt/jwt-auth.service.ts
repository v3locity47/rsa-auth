import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { IJwtPayload } from './jwt-auth.interface';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  authenticate(user: User) {
    const payload: IJwtPayload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
