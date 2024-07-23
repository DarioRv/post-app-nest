import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (!user) throw new InternalServerErrorException('User not found');

    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (validRoles.length == 0) return true;

    const allow = validRoles.some((validRole) => user.role.includes(validRole));
    if (!allow) throw new ForbiddenException('User needs a valid role');

    return true;
  }
}
