import * as mongoose from 'mongoose';
import { IUserSchema } from 'src/types';

export const UserSchema = new mongoose.Schema<IUserSchema>({
  email: String,
  password: String,
  fullname: String,
});
