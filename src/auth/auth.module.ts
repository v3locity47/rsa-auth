import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { PasswordService } from './password.service';
import { RSAModule } from './rsa/rsa.module';

@Module({
  imports: [RSAModule, forwardRef(() => UsersModule), JwtAuthModule],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
  exports: [PasswordService],
})
export class AuthModule {}
