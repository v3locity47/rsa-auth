import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RSAModule } from './rsa/rsa.module';

@Module({
  imports: [RSAModule],
  controllers: [AuthController],
})
export class AuthModule {}
