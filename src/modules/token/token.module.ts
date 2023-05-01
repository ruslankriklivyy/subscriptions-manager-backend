import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenService } from './token.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TokenService],
  imports: [PrismaModule, JwtModule.register({})],
  exports: [TokenService],
})
export class TokenModule {}
