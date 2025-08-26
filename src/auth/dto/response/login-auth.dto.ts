import { IsJWT, IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
  @IsJWT()
  @IsNotEmpty()
  access_token: string;
}
