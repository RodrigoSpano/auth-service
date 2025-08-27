/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import type { ILoginUserReq, IUser, IUserDocument } from 'src/types';
import { HydratedDocument } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/response/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private userServices: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(password: string, email: string): Promise<IUser> {
    // search user by email
    const user = (await this.userServices.findOneByEmail(
      email,
    )) as HydratedDocument<IUserDocument>;
    if (!user) {
      throw new BadRequestException();
    }
    // compare passwords
    const passwordMatches: boolean = await user.comparePassword(password);
    if (!passwordMatches) throw new UnauthorizedException();
    return user;
  }

  authenticate(userData: ILoginUserReq): LoginResponseDto {
    try {
      const jwtPayload = { sub: userData._id, email: userData.email };
      const jwtToken = this.jwtService.sign(jwtPayload);
      return {
        access_token: jwtToken,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
