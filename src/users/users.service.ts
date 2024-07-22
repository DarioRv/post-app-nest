import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordEncoder } from 'src/common/adapters/password-encoder.adapter';
import { UpdateUserDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class UsersService {
  logger = new Logger('UserService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto = {
        ...createUserDto,
        password: PasswordEncoder.encode(createUserDto.password),
      };

      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      const publicUser = this.convertToPublicUser(user);
      return publicUser;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundException(`User with id '${id}' not found`);

      const { password } = updateUserDto;
      if (password) {
        updateUserDto = {
          ...updateUserDto,
          password: PasswordEncoder.encode(password),
        };
      }

      const updatedUser = { ...user, ...updateUserDto };
      await this.userRepository.update({ id }, updatedUser);

      const publicUser = this.convertToPublicUser(updatedUser);
      return publicUser;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findOne(term: string) {
    let user: User;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
      return this.convertToPublicUser(user);
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    user = await queryBuilder
      .where(`username = :username OR fullName = :fullName`, {
        username: term,
        fullName: term,
      })
      .getOne();

    if (!user)
      throw new NotFoundException(`User with term '${term}' not found`);

    return this.convertToPublicUser(user);
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.update({ id: user.id }, { isActive: false });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private convertToPublicUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  private handleDbErrors(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
