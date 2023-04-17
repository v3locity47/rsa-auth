import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PasswordService } from '../auth/password.service';
import { AuthUser } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
  async create(data: Prisma.UserCreateInput): Promise<User | null> {
    const { password, ...restData } = data;
    const hashedPassword = password
      ? await this.passwordService.generateHash(password)
      : null;
    const createdUser = await this.prisma.user.create({
      data: { password: hashedPassword, ...restData },
    });
    return createdUser;
  }
  async findOrCreate(data: Prisma.UserCreateInput): Promise<AuthUser | null> {
    const user = await this.findOne({ email: data.email });
    console.log(user);
    if (user) {
      return { ...user, doesUserAlreadyExist: true };
    }
    const newUser = await this.create(data);
    return newUser;
  }
}
