import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  TUTOR = 'TUTOR',
  ASSESSOR = 'ASSESSOR',
  STUDENT = 'STUDENT',
  FAMILY = 'FAMILY',
  VISITOR = 'VISITOR',
  TEACHER_DIRECTIVE = 'TEACHER_DIRECTIVE',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
