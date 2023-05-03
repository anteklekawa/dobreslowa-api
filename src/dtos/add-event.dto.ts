import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddEventDto {
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(4)
  @ApiProperty({})
  title: string;

  @IsNotEmpty()
  @MaxLength(300)
  @MinLength(8)
  @ApiProperty({})
  shortDescription: string;

  @IsNotEmpty()
  @MaxLength(6000)
  @MinLength(10)
  @ApiProperty({})
  longDescription: string;

  imgUrls?: string[];
}