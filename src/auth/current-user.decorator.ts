import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDto } from './dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: UserDto = ctx.getContext().req.user;
    console.log('CurrentUser decorator: User:', user);
    if (!user) {
      throw new Error('Usuario no autenticado o sin nombre');
    }
    return user;
  },
);
