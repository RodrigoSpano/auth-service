/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { IUserDocument } from 'src/types';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class UserRepository extends EntityRepository<IUserDocument> {
  constructor(
    @InjectModel('User')
    readonly userModel: mongoose.Model<IUserDocument>,
  ) {
    super(userModel);
  }
}
