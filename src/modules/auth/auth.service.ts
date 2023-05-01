import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { ISignInPayload } from './interfaces/signin.interface';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(payload: ISignInPayload) {
    const user = await this.userService.getOne({
      field: 'email',
      value: payload.email,
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${payload.email}`);
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, refresh_token);

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  async signUp(payload) {
    const dirtyData = (payload?.data && JSON.parse(payload.data)) || {};

    const user = await this.userService.getOne({
      field: 'email',
      value: dirtyData.email,
    });

    if (user) {
      throw new BadRequestException(
        `User with that email ${dirtyData.email} already exist!`,
      );
    }

    const createdUser = await this.userService.create({
      ...dirtyData,
      avatar: payload.avatar,
    });
    const { access_token, refresh_token } =
      await this.tokenService.generateTokens(createdUser);
    await this.tokenService.saveToken(createdUser.id, refresh_token);

    return {
      user: createdUser,
      access_token,
      refresh_token,
    };
  }

  logout(userId: number) {
    return this.tokenService.removeToken(userId);
  }
}
