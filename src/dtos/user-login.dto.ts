import { IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}