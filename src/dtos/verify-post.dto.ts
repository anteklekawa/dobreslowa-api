import { IsIn, IsString, IsUUID } from "class-validator";

export class VerifyPostDto {
  @IsUUID()
  postId: string;

  @IsString()
  @IsIn(['pending', 'verified', 'declined'])
  verifyStatus: string;
}