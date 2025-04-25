import { DefaultValuePipe, Injectable, ParseIntPipe, Query, Scope } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Song } from '@prisma/client';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async create(songDTOs: CreateSongDto[]): Promise<Song[]> {
    const createdSongs: Song[] = [];

    for (const dto of songDTOs) {
      // 1. Find valid artists only
      const validArtists = await this.prisma.artist.findMany({
        where: { id: { in: dto.artists } },
        select: { id: true },
      });

      const existingIds = validArtists.map((artist) => artist.id);

      // 2. Optional strict validation: throw if some IDs are missing
      if (existingIds.length !== dto.artists.length) {
        throw new Error(`Invalid artist IDs for song "${dto.title}"`);
      }

      // 3. Create the song with the valid artists
      const song = await this.prisma.song.create({
        data: {
          title: dto.title,
          duration: dto.duration,
          lyrics: dto.lyrics,
          releasedDate: dto.releasedDate,
          artists: {
            connect: existingIds.map((id) => ({ id })),
          },
        },
        include: { artists: true },
      });

      createdSongs.push(song);
    }

    return createdSongs;
  }

  findAll(page: number = 1, limit: number = 10): Promise<Song[]> {
    return this.prisma.song.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        id: 'asc',
      },
      include: { artists: true },
    });
  }

  findOne(id: number): Promise<Song | null> {
    return this.prisma.song.findUnique({
      where: { id },
    });
  }
  async remove(id: number): Promise<void> {
    await this.prisma.song.delete({
      where: { id },
    });
  }
  async update(id: number, UpdateSongDTO: UpdateSongDto): Promise<Song> {
    return await this.prisma.song.update({
      where: {
        id,
      },
      data: UpdateSongDTO,
    });
  }
}
