/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IUser } from 'src/types';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from './dto/request/create-user.dto';
import mongoose from 'mongoose';

// helper
function generateFakeUser(): IUser {
  return {
    fullname: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

// fake db module
const mockUsers: IUser[] = Array.from({ length: 20 }, () => generateFakeUser());

const mockUserModel = {
  find: jest.fn().mockResolvedValue(mockUsers),
  create: jest.fn().mockImplementation((dto: CreateUserDto) =>
    Promise.resolve({
      _id: new mongoose.Types.ObjectId(),
      ...dto,
    }),
  ),
  // add other model methods you expect to be called
} as unknown as any; // cast to any to avoid TS errors

describe('userController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: 'USER_MODEL', useValue: mockUserModel },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should return an array of Users', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        password: expect.any(String),
        fullname: expect.any(String),
      }),
    );
  });
  it('should create a user', async () => {
    const fakeData: IUser = generateFakeUser();
    const newUser = await controller.create(fakeData);

    expect(newUser.email).toEqual(fakeData.email);
    expect(newUser.fullname).toEqual(fakeData.fullname);
    expect(newUser).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        password: expect.any(String),
        fullname: expect.any(String),
      }),
    );
  });
});
