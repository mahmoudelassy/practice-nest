import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from 'src/common/types/payload.type';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LoginDTO } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
  ) {}
  signup(userDTO: CreateUserDTO): Promise<Partial<User>> {
    return this.usersService.create(userDTO);
  }
  async login(userDTO: LoginDTO): Promise<{ accessToken: string }> {
    const { password, ...userWithoutPassword } = await this.usersService.findOne(userDTO);
    const isPasswordsMatched = await bcrypt.compare(userDTO.password, password);
    if (!isPasswordsMatched)
      throw new HttpException('Password does not match', HttpStatus.UNAUTHORIZED);
    const payload: PayloadType = {
      email: userWithoutPassword.email,
      userId: userWithoutPassword.id,
    };
    const artist = await this.artistsService.findArtist(userWithoutPassword.id);
    if (artist) {
      payload.artistId = artist.id;
    }
    return { accessToken: this.jwtService.sign(payload) };
  }
}
