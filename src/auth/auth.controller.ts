import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserSignInDto, UserSignUpDto } from './dto/auth.dto';
import { JwtAuthService } from './jwt/jwt-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtAuthService: JwtAuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() userSignUpDto: UserSignUpDto) {
    return this.usersService.findOrCreate(userSignUpDto);
  }

  @Get()
  async test() {
    return { test: 'test' };
  }

  @Post('signin')
  async signIn(@Body() userSignInDto: UserSignInDto) {
    const user = await this.authService.validateUser(
      userSignInDto.email,
      userSignInDto.password,
    );
    if (user) {
      const { accessToken } = this.jwtAuthService.authenticate(user);
      return { user, accessToken };
    }
  }
}
