import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { IJwtPayload } from './jwt-auth.interface';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const extractJwt = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      if (req && req.headers.authorization) {
        const headerValues = req.headers.authorization.split(' ');
        token = headerValues[1];
      }
      console.log(token);
      return token;
    };
    super({
      jwtFromRequest: extractJwt,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('RSA_PUBLIC_KEY'),
      algorithms: ['RS256'],
    });
  }
  async validate(payload: IJwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
