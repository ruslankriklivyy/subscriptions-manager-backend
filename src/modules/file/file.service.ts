import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(fileDto: CreateFileDto) {
    return this.prismaService.file.create({ data: fileDto });
  }
}
