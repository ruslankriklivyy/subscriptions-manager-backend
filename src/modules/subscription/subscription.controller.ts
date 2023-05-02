import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { uploadFilesLocalOptions } from '../../../config/upload-files-local-options.config';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getAll(@Query() query) {
    return this.subscriptionService.getAll(query);
  }

  @Get('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  getOne(@Param() { id }) {
    return this.subscriptionService.getOneById(Number(id));
  }

  @Post()
  @UseInterceptors(FileInterceptor('icon', uploadFilesLocalOptions))
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() dto, @UploadedFile() icon: Express.Multer.File) {
    return this.subscriptionService.create({ ...dto, icon });
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('icon', uploadFilesLocalOptions))
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  update(
    @Body() dto,
    @Param() { id },
    @UploadedFile() icon: Express.Multer.File,
  ) {
    return this.subscriptionService.update(id, { ...dto, icon });
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  delete(@Param() { id }) {
    return this.subscriptionService.delete(id);
  }
}
