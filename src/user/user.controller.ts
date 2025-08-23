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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/seed')
  seed() {
    return this.userService.seed();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

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
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!Object.keys(updateUserDto).length) throw new BadRequestException();
    return this.userService.update(id, updateUserDto);
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
