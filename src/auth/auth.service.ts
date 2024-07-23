import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from '../users/entities/user.entity';
import { PasswordEncoder } from '../common/adapters/password-encoder.adapter';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(userCredentials: UserCredentialsDto) {
    const { username, password } = userCredentials;
    const user = await this.userRepository.findOneBy({ username });

    if (!user) throw new BadRequestException('Credentials are not valid');

    if (!user.isActive)
      throw new BadRequestException('User is not currently active');

    if (!PasswordEncoder.compare(password, user.password))
      throw new BadRequestException('Credentials are not valid!');

    const payload: JwtPayload = {
      userId: user.id,
      userRole: user.role,
    };
    const token = this.createToken(payload);
    const publicUser = this.convertToPublicUser(user);

    return { user: publicUser, token };
  }

  refreshToken(user: User) {
    const payload: JwtPayload = {
      userId: user.id,
      userRole: user.role,
    };

    const token = this.createToken(payload);
    const publicUser = this.convertToPublicUser(user);

    return { user: publicUser, token };
  }

  private convertToPublicUser(user: User) {
    const publicUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    return publicUser;
  }

  private createToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
