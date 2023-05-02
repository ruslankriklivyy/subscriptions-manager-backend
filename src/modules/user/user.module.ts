import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  imports: [PrismaModule, ConfigModule, FileModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
