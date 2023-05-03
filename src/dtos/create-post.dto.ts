import { IsDateString, IsNotEmpty, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(400)
  @ApiProperty({})
  content: string;

  @ApiProperty({})
  imgUrl?: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({})
  author: string;
}