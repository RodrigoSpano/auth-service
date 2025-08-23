import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import mongoose from 'mongoose';
import { IUser } from 'src/types';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: mongoose.Model<IUser>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const newUser = new this.userModel(createUserDto, { new: true });
    await newUser.save();
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
