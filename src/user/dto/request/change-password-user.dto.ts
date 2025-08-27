import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
