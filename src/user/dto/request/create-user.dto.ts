/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, Min } from 'class-validator';
import type { IUser } from 'src/types';

export class CreateUserDto implements IUser {
  @IsEmail()
  email: string;

  @IsString()
  @Min(8)
  password: string;

  @IsString()
  @Min(4)
  fullname: string;
}
