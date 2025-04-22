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
  create(@Body() createSongDTO: CreateSongDto) {
    return this.songsService.create(createSongDTO);
  }
  @Get()
  findAll() {
    return this.songsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id, @Body() UpdateSongDTO: UpdateSongDto) {
    return this.songsService.update(id, UpdateSongDTO);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songsService.remove(id);
  }
}
