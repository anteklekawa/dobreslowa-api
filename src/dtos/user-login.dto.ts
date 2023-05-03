import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  login: string;

  @IsNotEmpty()
  @ApiProperty({})
  password: string;
}