import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class AddEventDto {
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(4)
  title: string;

  @IsNotEmpty()
  @MaxLength(250)
  @MinLength(8)
  shortDescription: string;

  @IsNotEmpty()
  @MaxLength(6000)
  @MinLength(10)
  longDescription: string;

  imgUrls?: string[];
}