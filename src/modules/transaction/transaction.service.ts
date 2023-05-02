import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { generateParams } from '../../helpers/generate-params';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll(params?: Record<string, any>) {
    const { newFilter, orderBy, pagination } = generateParams(params);

    return this.prismaService.transaction.findMany({
      where: newFilter,
      orderBy,
      take: pagination.take ?? 0,
      skip: pagination.skip ?? 0,
    });
  }

  getOne(id: number) {
    return this.prismaService.transaction.findUnique({
      where: { id },
      include: { subscription: true },
    });
  }

  create(payload) {
    return this.prismaService.transaction.create({
      data: payload,
      include: { subscription: true },
    });
  }

  update(id: number, payload) {
    return this.prismaService.transaction.update({
      where: { id },
      data: payload,
      include: { subscription: true },
    });
  }

  delete(id: number) {
    return this.prismaService.transaction.delete({
      where: { id },
      include: { subscription: true },
    });
  }
}
