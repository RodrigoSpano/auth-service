/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
  inputPass: string,
  storedPass: string,
): Promise<boolean> {
  const passwordsMatches: boolean = await bcrypt.compare(inputPass, storedPass);
  return passwordsMatches;
}
