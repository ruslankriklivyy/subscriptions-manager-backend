import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FileModule } from '../file/file.module';

@Module({
  providers: [SubscriptionService],
  imports: [PrismaModule, FileModule, ConfigModule],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
