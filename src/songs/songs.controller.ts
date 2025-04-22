import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Connection } from 'src/common/constants/connection';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from '@prisma/client';
@Controller({ path: 'songs', scope: Scope.REQUEST })
export class SongsController {
  constructor(
    private songsService: SongsService,
    @Inject('CONNECTION')
    private connection: Connection,
  ) {
    console.log(`THIS IS CONNECTION STRING ${this.connection.CONNECTION_STRING}`);
  }
  @Post()
  create(@Body() createSongDTOs: CreateSongDto[]) {
    return this.songsService.create(createSongDTOs);
  }
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Song[]> {
    return this.songsService.findAll(page, limit);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Song | null> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id, @Body() UpdateSongDTO: UpdateSongDto): Promise<Song> {
    return this.songsService.update(id, UpdateSongDTO);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }
}
