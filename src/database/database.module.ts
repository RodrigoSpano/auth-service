import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOCONNECTIONSTRING'),
        auth: {
          username: configService.get<string>('MONGOUSERNAME'),
          password: configService.get<string>('MONGOPASS'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabasseModule {}
