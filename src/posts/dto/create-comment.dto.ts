import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The comment body',
    example: 'This is a comment',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  body: string;
}
