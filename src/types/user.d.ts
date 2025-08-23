import { Document } from 'mongoose';

export interface IUser {
  email: string;
  fullname: string;
  password: string;
}
