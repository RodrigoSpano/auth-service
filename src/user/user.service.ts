/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import mongoose, { type HydratedDocument } from 'mongoose';
import type { IUser, IUserDocument } from 'src/types';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: mongoose.Model<HydratedDocument<IUser>>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<HydratedDocument<IUser>> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      if (!newUser) {
        throw new BadRequestException();
      }
      return newUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // todo => filters/queries
  async findAll(): Promise<IUser[]> {
    try {
      return await this.userModel.find({});
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<HydratedDocument<IUser>> {
    try {
      const findUser = await this.userModel.findOne({ email });
      if (!findUser) {
        throw new NotFoundException();
      }
      return findUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneById(id: string): Promise<IUserDocument> {
    try {
      const findUser = (await this.userModel.findById(id)) as IUserDocument;
      if (!findUser) {
        throw new NotFoundException();
      }
      return findUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    try {
      // verify if user exists
      const user = await this.findOneById(id);

      let finalData: UpdateUserDto = updateUserDto;
      if (
        updateUserDto.password != undefined &&
        updateUserDto.password.length > 0
      ) {
        const { password } = updateUserDto;
        const hashedPass = await user.hashPass(password);
        finalData = { ...updateUserDto, password: hashedPass };
      }
      await this.userModel.updateOne({ _id: id }, finalData);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const findUser = await this.findOneById(id);
      await this.userModel.deleteOne({ _id: id });
      return `user ${findUser.fullname} deleted`;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteAll() {
    await this.userModel.deleteMany({});
    console.log('all deleted');
  }

  async seed() {
    try {
      const fakeArr: IUser[] = Array.from({ length: 20 }, () => ({
        fullname: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }));
      await this.userModel.insertMany(fakeArr);
      console.log('users created');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
