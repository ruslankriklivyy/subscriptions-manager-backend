import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { GetOneUserInterface } from './interfaces/get-one-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from '../file/file.service';
import excludeColumns from '../../helpers/exclude-columns';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {}

  getOne({ field, value }: GetOneUserInterface) {
    return this.prismaService.user.findUnique({
      where: { [field]: value },
      include: { avatar: true },
    });
  }

  async create(payload: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(this.configService.get('ROUNDS_OF_HASHING_PASSWORD')),
    );
    const newUser = {
      avatar_id: null,
      email: payload.email,
      password: hashedPassword,
      birth_date: payload.birth_date,
      full_name: payload.full_name,
    };

    if (payload.avatar) {
      const uploadedFilePath = this.configService.get('UPLOADED_FILE_PATH');
      const avatar = await this.fileService.create({
        name: payload.avatar.filename,
        url: `${uploadedFilePath}/${payload.avatar.filename}`,
        size: payload.avatar.size,
      });
      newUser.avatar_id = avatar.id;
    }

    return this.prismaService.user.create({
      data: newUser,
      include: { avatar: true },
    });
  }

  async update(id: number, payload) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const dirtyData = (payload?.data && JSON.parse(payload.data)) || {};

    const newUser = {
      email: dirtyData.email || user.email,
      birth_date: dirtyData.birth_date || user.birth_date,
      full_name: dirtyData.full_name || user.full_name,
    };

    if (payload.avatar) {
      const uploadedFilePath = this.configService.get('UPLOADED_FILE_PATH');
      const avatar = await this.fileService.create({
        name: payload.avatar.filename,
        url: `${uploadedFilePath}/${payload.avatar.filename}`,
        size: payload.avatar.size,
      });

      await this.fileService.delete(user.avatar_id);

      newUser['avatar_id'] = avatar.id;
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: newUser,
      include: { avatar: true },
    });

    return excludeColumns(updatedUser, ['password']);
  }
}
