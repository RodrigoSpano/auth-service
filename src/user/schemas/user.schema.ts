import * as mongoose from 'mongoose';
import type { IUser } from 'src/types';

export const UserSchema = new mongoose.Schema<IUser>(
  {
    email: String,
    password: String,
    fullname: String,
  },
  { _id: true, timestamps: true },
);
