import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { IUser } from '../user/interfaces/user.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateTokens(user: IUser) {
    const payload = { ...user, id: user.id.toString() };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async generateTokensFromGoogle(payload) {
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const token = await this.prismaService.token.findUnique({
      where: { user_id: userId },
    });

    if (token) {
      return this.prismaService.token.update({
        where: { user_id: userId },
        data: { refresh_token: refreshToken },
      });
    }

    return this.prismaService.token.create({
      data: {
        user_id: userId,
        refresh_token: refreshToken,
      },
      include: { user: true },
    });
  }

  removeToken(userId: number) {
    return this.prismaService.token.delete({ where: { user_id: userId } });
  }

  validateAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch (error) {
      return null;
    }
  }
}
