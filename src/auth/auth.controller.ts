import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUserFromAuth } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 201, description: 'User signed in' })
  @ApiResponse({ status: 400, description: 'Credentials are not valid' })
  @ApiResponse({ status: 400, description: 'User is not currently active' })
  @Post('sign-in')
  signIn(
    @Body()
    userCredentials: UserCredentialsDto,
  ) {
    return this.authService.signIn(userCredentials);
  }

  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'missing or related token' })
  @ApiBearerAuth()
  @Auth()
  @Get('refresh-token')
  private(
    @GetUserFromAuth()
    user: User,
  ) {
    return this.authService.refreshToken(user);
  }
}
