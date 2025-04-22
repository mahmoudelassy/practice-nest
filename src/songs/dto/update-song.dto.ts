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
  readonly title;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists;

  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: string;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
