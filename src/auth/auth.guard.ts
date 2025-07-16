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
    const gqlContext = GqlExecutionContext.create(context);
    const { req, connection } = gqlContext.getContext();

    // Determine the request object based on the context type (HTTP or WebSocket)
    const request = connection ? connection.context : req;

    const authHeader =
      request.headers?.authorization || request.Authorization;

    if (!authHeader) {
      this.logger.warn('No authorization token provided.');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      this.logger.log(`Token verified for user: ${payload.email}`);
      
      // Attach user to the appropriate context
      if (connection) {
        connection.context.user = payload;
      } else {
        req.user = payload;
      }
      
      return true;
    } catch (error) {
      this.logger.error('Token verification failed', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
