import { Request } from 'express';
import mongoose from 'mongoose';

// payload types
export interface IJwtPayload {
  sub: mongoose.Types.ObjectId;
  email: string;
}

// local-strat return types
export interface ILoginUserReq extends Omit<IJwtPayload, 'sub'> {
  _id: mongoose.Types.ObjectId;
}

// login POST request
export interface ILoginRequest extends Request {
  user: ILoginUserReq;
}
