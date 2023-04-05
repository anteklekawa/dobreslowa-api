import { IsDate, IsNotEmpty, IsUUID, MaxLength, MinLength } from "class-validator";

export class AddCommentDto {
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @IsNotEmpty()
  @IsUUID()
  author: string;

  @IsNotEmpty()
  @IsDate()
  datetime: Date;

  @IsNotEmpty()
  @IsUUID()
  postId: string;
}