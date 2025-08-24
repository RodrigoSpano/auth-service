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
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private userServices: UserService,
    // private jwtService: JwtService,
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

  authenticate(userData: ILoginUserReq) {
    try {
      // if ok generate jwt token
      console.log(`auth >>>`, userData);
      const jwtPayload = { sub: userData._id, email: userData.email };
      // const jwtToken = this.jwtService.sign(jwtPayload);
      // return data and token
      return jwtPayload;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
