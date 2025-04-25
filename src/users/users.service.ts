import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(userDTO: CreateUserDTO): Promise<Partial<User>> {
    const salt = await bcrypt.genSalt();
    userDTO.password = await bcrypt.hash(userDTO.password, salt);
    const { password, ...userWithoutPassword } = await this.prisma.user.create({ data: userDTO });
    return userWithoutPassword;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }
}
