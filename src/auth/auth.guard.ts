import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No authorization token provided.');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      this.logger.log(`Token verified for user: ${payload.email}`);
      req.user = payload;
      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
