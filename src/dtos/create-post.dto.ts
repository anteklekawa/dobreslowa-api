import { IsDateString, IsNotEmpty, IsUUID, MaxLength } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(400)
  content: string;

  imgUrl?: string;

  @IsNotEmpty()
  @IsDateString()
  datetime: Date;

  @IsNotEmpty()
  @IsUUID()
  author: string;
}