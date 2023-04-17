import { Body, Controller, Post } from '@nestjs/common';
import { RSAService } from './rsa/rsa.service';

@Controller('/auth')
export class AuthController {
  constructor(private rsaService: RSAService) {}
  @Post('/signin')
  async signin(@Body() signinDto: any) {
    console.log(signinDto);
    const t = this.rsaService.generateKeyPair();
    console.log(t);
  }
}
