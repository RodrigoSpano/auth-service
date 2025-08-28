import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { usersProviders } from './user.providers';
import { DatabasseModule } from 'src/database/database.module';

@Module({
  imports: [DatabasseModule],
  controllers: [UserController],
  providers: [UserService],
  // providers: [UserService, ...usersProviders],
  exports: [UserService],
})
export class UserModule {}
