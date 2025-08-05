import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context);
    const { req, connection } = ctx.getContext();
    const user = connection ? connection.context.user : req.user;

    this.logger.debug(`Required roles: ${requiredRoles}`);
    this.logger.debug(`User roles: ${user?.roles}`);

    if (!user || !user.roles) {
      this.logger.warn('RolesGuard: User object is undefined, null, or has no roles.');
      return false; // Deny access if user is not defined or has no roles
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
