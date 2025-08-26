import type { IJwtPayload, ILoginUserReq } from 'src/types';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type IJwtStrategyValidateResponse = ILoginUserReq & {};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWTSECRET');
    if (!secret) {
      throw new Error('JWT secret is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: IJwtPayload): IJwtStrategyValidateResponse {
    // here can apply any logic to the incoming jwt encrypted data
    return { _id: payload.sub, email: payload.email };
  }
}
