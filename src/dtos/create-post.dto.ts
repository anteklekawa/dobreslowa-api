import { IsDate, IsNotEmpty, IsUrl, IsUUID, MaxLength } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(400)
  content: string;

  @IsUrl()
  imgUrl?: string;

  @IsNotEmpty()
  @IsDate()
  datetime: Date;

  @IsNotEmpty()
  @IsUUID()
  author: string;
}