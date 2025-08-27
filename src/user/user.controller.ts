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
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { PublicEndpoint } from 'src/utils/ispublic.decorator';
import { UpdatePasswordUserDto } from './dto/request/change-password-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PublicEndpoint()
  @Get('/seed')
  seed() {
    return this.userService.seed();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
    // check if exists
    await this.userService.findOneById(id);
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: UpdatePasswordUserDto,
  ) {
    // srp (single responsability principle)
    // each service should do his task, no more.
    // thats why instead of doing all of this in the updatePassword service method, i call different methods here in the controller
    // find user
    const user = await this.userService.findOneById(id);
    // hash new password using user.hashpass method
    const hashedPassword = await user.hashPass(body.password);
    // update password sending the hasedpassword
    await this.userService.updatePassword(id, hashedPassword);
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
