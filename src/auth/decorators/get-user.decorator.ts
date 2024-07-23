import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Gets the user from the authentication method.
 *
 * The Auth decorator must be used before.
 *
 * For example:
 * ```typescript
 * .@Auth()
 * .@Get('private-route')
 * .privateRoute(@GetUserFromAuth user: User)
 * ```
 */
export const GetUserFromAuth = createParamDecorator(
  (prop: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException(
        'User not found, make sure that you are using the Auth decorator',
      );

    if (!prop) return user;

    const userProperty = user[prop];
    if (!userProperty)
      throw new InternalServerErrorException(
        `Unexpected property in user, trying to get '${prop}' property`,
      );

    return userProperty;
  },
);
