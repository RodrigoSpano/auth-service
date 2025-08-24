/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import type { ILoginUserReq, IUserDocument } from 'src/types';
import mongoose from 'mongoose';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<ILoginUserReq> {
    const user = (await this.authService.validateUser(
      password,
      email,
    )) as IUserDocument;
    return {
      _id: user._id as mongoose.Types.ObjectId,
      email: user.email,
    };
  }
}
