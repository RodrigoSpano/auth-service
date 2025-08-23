/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { type Document } from 'mongoose';
import type { IUser, IUserDocument } from 'src/types';
import { comparePassword, hashPassword } from 'src/utils/hashPassword.helper';

export const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    email: String,
    password: String,
    fullname: String,
  },
  { _id: true, timestamps: true },
);

UserSchema.pre('save', async function (next: NextFunction) {
  const user = this as IUserDocument;

  if (!user.isModified('password')) return next();
  await user.hashPass(user.password);
  next();
});

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

UserSchema.methods.hashPass = async function (
  password: string,
): Promise<string> {
  const user = this as Document & IUser;

  const hashedPass = await hashPassword(password);
  user.password = hashedPass;
  return hashedPass;
};
