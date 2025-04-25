import { PlaylistsController } from './playlists.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PlaylistService } from './playlists.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [PlaylistsController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
