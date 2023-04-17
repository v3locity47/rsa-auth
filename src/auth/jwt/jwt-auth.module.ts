import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';

const jwtConfigFactory = async (configService: ConfigService) => {
  return {
    privateKey: configService.get<string>('RSA_PRIVATE_KEY'),
    publicKey: configService.get<string>('RSA_PUBLIC_KEY'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
    },
  };
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: jwtConfigFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
