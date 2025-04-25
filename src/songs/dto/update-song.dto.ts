import {
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
} from '@nestjs/class-validator';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  title;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  artists;

  @IsDateString()
  @IsOptional()
  releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  duration: string;

  @IsString()
  @IsOptional()
  lyrics: string;
}
