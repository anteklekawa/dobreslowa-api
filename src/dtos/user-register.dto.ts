import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserRegisterDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty({})
  username: string;

  @IsNotEmpty()
  @ApiProperty({})
  password: string;

  @IsNotEmpty()
  @MaxLength(320)
  @MinLength(5)
  @ApiProperty({})
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(1)
  @ApiProperty({})
  name: string;

  @IsNotEmpty()
  @MaxLength(60)
  @MinLength(1)
  @ApiProperty({})
  surname: string;
}