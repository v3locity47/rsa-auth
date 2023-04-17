import { User } from '@prisma/client';

export interface AuthUser extends User {
  doesUserAlreadyExist?: boolean;
}
