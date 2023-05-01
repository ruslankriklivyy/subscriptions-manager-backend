import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { GetOneUserInterface } from './interfaces/get-one-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  getOne({ field, value }: GetOneUserInterface) {
    return this.prismaService.user.findUnique({ where: { [field]: value } });
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.configService.get('ROUNDS_OF_HASHING_PASSWORD'),
    );
    const newUser: CreateUserDto = {
      avatar: null,
      email: createUserDto.email,
      password: hashedPassword,
      birth_date: createUserDto.birth_date,
      full_name: createUserDto.full_name,
    };

    if (createUserDto.avatar) {
      const uploadedFilePath = this.configService.get('UPLOADED_FILE_PATH');
      const avatar = await this.fileService.create({
        name: createUserDto.avatar.filename,
        url: `${uploadedFilePath}/${createUserDto.avatar.filename}`,
        size: createUserDto.avatar.size,
      });
      newUser.avatar = avatar;
    }

    return this.prismaService.user.create({ data: newUser });
  }
}
