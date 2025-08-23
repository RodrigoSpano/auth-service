import { Document } from 'mongoose';

export interface IUser {
  email: string;
  fullname: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(): Promise<boolean>;
  hashPass(password: string): promise<string>;
}
