import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTGuard } from 'src/auth/gaurd/jwt.gaurd';
import { GetUser } from './decoreator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JWTGuard)
  @Get()
  async getMe(@GetUser('userId') id: number) {
    return await this.userService.getUser(id);
  }
}
