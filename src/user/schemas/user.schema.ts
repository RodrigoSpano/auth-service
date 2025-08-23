/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as mongoose from 'mongoose';
import type { IUser } from 'src/types';

import { comparePassword, hashPassword } from 'src/utils/hashPassword.helper';

export const UserSchema = new mongoose.Schema<IUser>(
  {
    email: String,
    password: String,
    fullname: String,
  },
  { _id: true, timestamps: true },
);

UserSchema.pre('save', hashPassword);

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as Document & IUser;
  const matches: boolean = await comparePassword(
    candidatePassword,
    user.password,
  );
  return matches;
};
