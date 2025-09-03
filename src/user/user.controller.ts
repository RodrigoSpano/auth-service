/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PublicEndpoint } from 'src/utils/ispublic.decorator';
import { UpdatePasswordDto, CreateUserDto, UpdateUserDto } from './dto/request';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicEndpoint()
  @Get('/seed')
  seed() {
    return this.userService.seed();
  }

  @PublicEndpoint()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const userExists = await this.userService.findOneByEmail(
      createUserDto.email,
    );
    if (!userExists) {
      return this.userService.create(createUserDto);
    }
    throw new BadRequestException('User already exists');
  }

  @PublicEndpoint()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/find')
  findOneByEmail(@Query('email') email: string) {
    if (!email) throw new BadRequestException();
    return this.userService.findOneByEmail(email);
  }

  @Get('/find/:id')
  findOneById(@Param('id') id: string) {
    if (!id) throw new BadRequestException();
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!Object.keys(updateUserDto).length) throw new BadRequestException();
    await this.userService.findOneById(id);
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (!Object.keys(updatePasswordDto).length) throw new BadRequestException();
    const user = await this.userService.findOneById(id);
    const hashedNewPassword = await user.hashPass(updatePasswordDto.password);
    return this.userService.changePassword(id, hashedNewPassword);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete('/admin/all')
  deleteAll() {
    return this.userService.deleteAll();
  }
}
