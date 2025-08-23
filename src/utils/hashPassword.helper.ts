/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextFunction } from 'express';
import { Document } from 'mongoose';
import type { IUser } from 'src/types';
import * as bcrypt from 'bcrypt';

export async function hashPassword(next: NextFunction) {
  const user = this as Document & IUser;

  if (!user.isModified('password')) return next();
  console.log(user.password);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(user.password, salt);
  console.log(this.password);
  next();
}

export async function comparePassword(
  inputPass: string,
  storedPass: string,
): Promise<boolean> {
  const passwordsMatches: boolean = await bcrypt.compare(inputPass, storedPass);
  return passwordsMatches;
}
