import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    console.log(user);
    const isPasswordCorrect = await this.passwordService.compare(
      password,
      user?.password,
    );
    if (user && isPasswordCorrect) {
      const { password, ...userData } = user;
      return userData;
    }
    return null;
  }
}
