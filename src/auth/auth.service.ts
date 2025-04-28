import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType } from 'src/common/types/auth-types';
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
  async login(
    userDTO: LoginDTO,
  ): Promise<{ accessToken: string } | { validate2FA: string; message: string }> {
    const { password, ...userWithoutPassword } = await this.usersService.findByEmail(userDTO.email);

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

    if (userWithoutPassword.enable2FA && userWithoutPassword.twoFASecret) {
      return {
        validate2FA: 'http://localhost:3000/auth/validate-2fa',
        message: 'Please send the one-time password/token from your Google Authenticator App',
      };
    }

    return { accessToken: this.jwtService.sign(payload) };
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.usersService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret! };
    }
    const secret = speakeasy.generateSecret();
    user.twoFASecret = secret.base32;
    await this.usersService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }
  async disable2FA(userId: number): Promise<User> {
    return this.usersService.disable2FA(userId);
  }
  async validate2FAToken(userId: number, token: string): Promise<{ verified: boolean }> {
    try {
      const user = await this.usersService.findById(userId);
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret!,
        token: token,
        encoding: 'base32',
      });
      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
  }
}
