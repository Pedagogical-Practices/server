import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';


export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const reqUser = ctx.getContext().req.user; // Este es el payload del JWT (con 'sub')

    // Mapear el payload del JWT a la estructura de UserDto
    const user = {
      id: reqUser.sub, // Mapear 'sub' a 'id'
      name: reqUser.name, // Asumiendo que el nombre está en el payload
      email: reqUser.email,
      role: reqUser.role,
      // Asegúrate de que todas las propiedades requeridas por UserDto estén aquí
    };

    return user;
  },
);
