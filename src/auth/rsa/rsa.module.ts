import { Module } from '@nestjs/common';
import { RSAService } from './rsa.service';

@Module({
  providers: [RSAService],
  exports: [RSAService],
})
export class RSAModule {}
