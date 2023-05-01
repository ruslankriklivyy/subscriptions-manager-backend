import { NotFoundException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { FileService } from '../file/file.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  getAll(params?: Record<string, any>) {
    const { skip, take, sort } = params;

    const pagination: Partial<{ skip: number; take: number }> = {};
    let newSort = {};

    if (sort && Object.keys(sort)?.length) {
      newSort = Object.keys(sort).map((key) => {
        return { [key]: { endsWith: sort[key] } };
      })[0];
    }

    if (skip) {
      pagination['skip'] = Number(skip);
    }
    if (take) {
      pagination['take'] = Number(take);
    }

    return this.prismaService.subscription.findMany({
      include: { icon: true },
      where: newSort,
      take: pagination.take ?? 0,
      skip: pagination.skip ?? 0,
    });
  }

  getOneById(id: number) {
    return this.prismaService.subscription.findUnique({ where: { id } });
  }

  async create(payload) {
    const dirtyData = (payload?.data && JSON.parse(payload.data)) || {};
    const newSubscription = { ...dirtyData };

    if (payload?.icon) {
      const uploadedFilePath = this.configService.get('UPLOADED_FILE_PATH');
      const icon = await this.fileService.create({
        name: payload.icon.filename,
        url: `${uploadedFilePath}/${payload.icon.filename}`,
        size: payload.icon.size,
      });
      newSubscription.icon_id = icon.id;
    }

    return this.prismaService.subscription.create({
      data: newSubscription,
      include: { icon: true, transactions: true },
    });
  }

  async update(id: number, payload) {
    const dirtyData = (payload?.data && JSON.parse(payload.data)) || {};
    const subscription = await this.prismaService.subscription.findUnique({
      where: { id },
    });
    const newSubscription = { ...dirtyData };

    if (!subscription) {
      throw new NotFoundException(`Subscription not found`);
    }

    if (payload.icon) {
      const uploadedFilePath = this.configService.get('UPLOADED_FILE_PATH');
      const icon = await this.fileService.create({
        name: payload.icon.filename,
        url: `${uploadedFilePath}/${payload.icon.filename}`,
        size: payload.icon.size,
      });
      newSubscription.icon_id = icon.id;
    }

    return this.prismaService.subscription.update({
      where: { id },
      data: dirtyData,
      include: { icon: true, transactions: true },
    });
  }

  async delete(id: number) {
    const subscription = await this.prismaService.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription not found`);
    }

    return this.fileService.delete(subscription.icon_id);
  }
}
