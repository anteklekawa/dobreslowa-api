import { IsIn, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyCommentDto {
  @IsUUID()
  @ApiProperty({})
  commentId: string;

  @IsString()
  @IsIn(['pending', 'verified', 'declined'])
  @ApiProperty({})
  verifyStatus: string;
}