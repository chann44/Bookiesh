import { Injectable } from '@nestjs/common';

import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private db: DbService) {}
  async getUser(id: number) {
    return this.db.user.findUnique({
      where: {
        id,
      },
    });
  }
}
