import { Module } from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TransactionService],
  imports: [PrismaModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
