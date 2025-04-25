import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from '@nestjs/class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  artists;

  @IsDateString()
  @IsNotEmpty()
  releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsOptional()
  lyrics: string;
}
