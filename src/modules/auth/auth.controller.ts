import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { uploadFilesLocalOptions } from '../../../config/upload-files-local-options.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @UseInterceptors(FileInterceptor('avatar', uploadFilesLocalOptions))
  @HttpCode(201)
  signUp(@Body() dto, @UploadedFile() avatar: Express.Multer.File) {
    return this.authService.signUp({ ...dto, avatar });
  }

  @Post('/sign-in')
  @HttpCode(200)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
