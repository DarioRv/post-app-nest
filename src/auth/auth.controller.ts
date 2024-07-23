import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUserFromAuth } from './decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(
    @Body()
    userCredentials: UserCredentialsDto,
  ) {
    return this.authService.signIn(userCredentials);
  }

  @Auth()
  @Get('refresh-token')
  private(
    @GetUserFromAuth()
    user: User,
  ) {
    return this.authService.refreshToken(user);
  }
}
