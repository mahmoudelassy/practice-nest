/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Scope } from '@nestjs/common';
import { Playlist } from '@prisma/client';
import { PlaylistService } from './playlists.service';
import { CreatePlayListDto } from './dto/create-playlist.dto';

@Controller({ path: 'playlists', scope: Scope.REQUEST })
export class PlaylistsController {
  constructor(private playlistsService: PlaylistService) {}
  @Post()
  create(@Body() createPlaylistDTOs: CreatePlayListDto[]): Promise<Playlist[]> {
    return this.playlistsService.create(createPlaylistDTOs);
  }
}
