import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UserRegisterDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @MaxLength(320)
  @MinLength(5)
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(1)
  name: string;

  @IsNotEmpty()
  @MaxLength(60)
  @MinLength(1)
  surname: string;
}