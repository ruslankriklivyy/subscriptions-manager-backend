import {
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getAll(@Query() query) {
    return this.transactionService.getAll(query);
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getOne(@Param() { id }) {
    return this.transactionService.getOne(Number(id));
  }
}
