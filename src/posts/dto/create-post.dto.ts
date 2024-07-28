import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The post title', example: 'This is a post' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty({ description: 'The post body', example: 'This is a post body' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  body: string;
}
