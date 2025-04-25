import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prismaService: PrismaService) {}
  findArtist(userId: number) {
    return this.prismaService.artist.findUnique({ where: { userId: userId } });
  }
}
