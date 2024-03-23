import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
