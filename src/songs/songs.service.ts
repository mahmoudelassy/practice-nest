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

  async create(createSongDTOs: CreateSongDto[]): Promise<Song[]> {
    return await Promise.all(
      createSongDTOs.map((createSongDTO) =>
        this.prisma.song.create({
          data: createSongDTO,
        }),
      ),
    );
  }

  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Song[]> {
    return this.prisma.song.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        id: 'asc',
      },
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
