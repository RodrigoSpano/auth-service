import { Document } from 'mongoose';

export interface IUser {
  email: string;
  fullname: string;
  password: string;
}

export interface IUserSchema extends IUser, Document {}
