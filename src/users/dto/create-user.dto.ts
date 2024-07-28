import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username to identify the user',
    example: 'john_doe',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  username: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe@email.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password to sign in', example: 'DoeJohn1234@' })
  @IsString()
  @IsStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 })
  password: string;
}
