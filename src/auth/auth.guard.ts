import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const authHeader = req.headers.authorization;
    console.log('AuthGuard: Authorization header:', authHeader);
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload: UserDto = this.jwtService.verify(token);
      console.log('AuthGuard: Payload:', payload);
      req.user = payload;
      return true;
    } catch (error) {
      console.error('AuthGuard: Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
