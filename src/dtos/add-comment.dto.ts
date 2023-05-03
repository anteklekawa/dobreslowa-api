import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddCommentDto {
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({})
  content: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({})
  author: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({})
  postId: string;
}