import { Injectable, Scope } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Song } from '@prisma/client';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async create(createSongDTO: CreateSongDto): Promise<Song> {
    const song: Partial<Song> = {};
    song.title = createSongDTO.title;
    song.releasedDate = createSongDTO.releasedDate;
    song.duration = createSongDTO.duration;
    song.lyrics = createSongDTO.lyrics;

    return this.prisma.song.create({
      data: createSongDTO,
    });
  }

  findAll(): Promise<Song[]> {
    return this.prisma.song.findMany();
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
  update(id: number, UpdateSongDTO: UpdateSongDto) {
    return this.prisma.song.update({
      where: {
        id,
      },
      data: UpdateSongDTO,
    });
  }
}
