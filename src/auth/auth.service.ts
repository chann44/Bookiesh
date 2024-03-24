import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { DbService } from '../db/db.service';
import { CreateUserDto } from './dtos';
import { comparePassword, hashPassword } from '../lib/password';
import { INCORRECT_CREDENTIALS } from '../lib/exception';

@Injectable()
export class AuthService {
  constructor(
    private db: DbService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: CreateUserDto) {
    try {
      const { email, password } = dto;
      const user = await this.db.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) throw new ForbiddenException(INCORRECT_CREDENTIALS);

      const passwordMatched = await comparePassword(user.hash, password);

      if (!passwordMatched) throw new ForbiddenException(INCORRECT_CREDENTIALS);
      const access_token = await this.signToken(user.id, email);

      return {
        access_token,
      };
    } catch (error) {
      throw error;
    }
  }
  async register(dto: CreateUserDto) {
    try {
      const { email, password } = dto;
      const hash = await hashPassword(password);
      const user = await this.db.user.create({
        data: {
          email,
          hash,
        },
      });
      return this.signToken(user.id, email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('User Already Exist');
        }
      } else {
        throw error;
      }
    }
  }
  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SEC');
    return this.jwtService.signAsync(payload, {
      secret,
    });
  }
}
