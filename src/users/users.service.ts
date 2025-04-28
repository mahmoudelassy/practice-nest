import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async create(userDTO: CreateUserDTO): Promise<Partial<User>> {
    const salt = await bcrypt.genSalt();
    userDTO.password = await bcrypt.hash(userDTO.password, salt);
    const { password, ...userWithoutPassword } = await this.prismaService.user.create({
      data: userDTO,
    });
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }
  async findById(userId: number): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }
  async updateSecretKey(userId: number, twoFASecret: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        twoFASecret: twoFASecret,
        enable2FA: true,
      },
    });
  }
  async disable2FA(userId: number) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        twoFASecret: null,
        enable2FA: false,
      },
    });
  }
}
