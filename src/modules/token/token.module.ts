import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { TokenService } from './token.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TokenService],
  imports: [PrismaModule, ConfigModule, JwtModule.register({})],
  exports: [TokenService],
})
export class TokenModule {}
