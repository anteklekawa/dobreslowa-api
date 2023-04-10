import { IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class AddCommentDto {
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @IsNotEmpty()
  @IsUUID()
  author: string;

  @IsNotEmpty()
  @IsUUID()
  postId: string;
}