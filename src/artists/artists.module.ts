import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
