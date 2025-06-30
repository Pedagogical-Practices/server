import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const UserRoles = {
  ADMIN: 'admin',
  STUDENT: 'student',
  TEACHER_DIRECTIVE: 'teacher_directive',
  ADMINISTRATIVE: 'administrative',
  FAMILY: 'family',
  COORDINATOR: 'coordinator',
};
