import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePlayListDto } from './dto/create-playlist.dto';
import { Playlist } from '@prisma/client';

@Injectable()
export class PlaylistService {
  constructor(private prisma: PrismaService) {}

  async create(createPlayListDTOs: CreatePlayListDto[]): Promise<Playlist[]> {
    const createdPlaylists: Playlist[] = [];
    for (const playlistDto of createPlayListDTOs) {
      const validSongs = await this.prisma.song.findMany({
        where: { id: { in: playlistDto.songs } },
        select: { id: true },
      });
      const isValidUser = await this.prisma.user.findFirst({ where: { id: playlistDto.user } });
      console.log(validSongs);
      console.log(playlistDto.songs);
      if (!isValidUser) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      if (validSongs.length !== playlistDto.songs.length)
        throw new HttpException('one or more song are not existed', HttpStatus.NOT_FOUND);
      const playlist = await this.prisma.playlist.create({
        data: {
          name: playlistDto.name,
          userId: playlistDto.user,
          songs: { connect: validSongs },
        },
        include: { songs: true, user: true },
      });
      createdPlaylists.push(playlist);
    }

    return createdPlaylists;
  }
}
