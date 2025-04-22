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
  readonly title;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists;

  @IsDateString()
  @IsNotEmpty()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: string;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
