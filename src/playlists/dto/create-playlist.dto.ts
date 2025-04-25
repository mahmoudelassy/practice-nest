import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreatePlayListDto {
  @IsString()
  @IsNotEmpty()
  name;
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  songs;
  @IsNumber()
  @IsNotEmpty()
  user: number;
}
