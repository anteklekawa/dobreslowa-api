import { IsIn, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyPostDto {
  @IsUUID()
  @ApiProperty({})
  postId: string;

  @IsString()
  @IsIn(['pending', 'verified', 'declined'])
  @ApiProperty({})
  verifyStatus: string;
}