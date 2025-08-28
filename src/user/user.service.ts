/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import type { IUserDocument } from 'src/types';
import { faker } from '@faker-js/faker';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    // @Inject('USER_MODEL')
    // private readonly userModel: mongoose.Model<HydratedDocument<IUser>>,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    try {
      const newUser = await this.userRepository.create(createUserDto);
      if (!newUser) {
        throw new BadRequestException();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // todo => filters/queries
  async findAll(): Promise<IUserDocument[]> {
    try {
      return (await this.userRepository.find({})) as IUserDocument[];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneByEmail(email: string): Promise<IUserDocument> {
    try {
      const findUser = await this.userRepository.findOne({ email });
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
      const findUser = (await this.userRepository.findOne({
        _id: id,
      })) as IUserDocument;
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
      await this.userRepository.updateOne({ _id: id }, finalData);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const findUser = await this.findOneById(id);
      await this.userRepository.deleteOne({ _id: id });
      return `user ${findUser.fullname} deleted`;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteAll() {
    await this.userRepository.deleteMany({});
    console.log('all deleted');
  }

  async seed() {
    try {
      const fakeArr = Array.from({ length: 20 }, () => ({
        fullname: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })) as IUserDocument[];
      await this.userRepository.insertMany(fakeArr);
      console.log('users created');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
