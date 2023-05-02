import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { uploadFilesLocalOptions } from '../../../config/upload-files-local-options.config';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar', uploadFilesLocalOptions))
  @UseGuards(JwtAuthGuard)
  update(
    @Body() dto,
    @Param() { id },
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.userService.update(Number(id), { ...dto, avatar });
  }
}
