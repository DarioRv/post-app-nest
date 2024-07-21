import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  body: string;

  @IsString()
  @IsNotEmpty()
  postId: string;
}
