import { User } from '../../users/entities/user.entity';

export const convertToPublicUser = (user: User) => {
  const publicUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };

  return publicUser;
};
