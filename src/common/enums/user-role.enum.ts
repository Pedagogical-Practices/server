import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER_DIRECTIVE = 'TEACHER_DIRECTIVE',
  STUDENT = 'STUDENT',
  FAMILY = 'FAMILY',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
