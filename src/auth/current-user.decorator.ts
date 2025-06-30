import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDto } from './dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const reqUser = ctx.getContext().req.user; // Este es el payload del JWT (con 'sub')

    // Mapear el payload del JWT a la estructura de UserDto
    const user: UserDto = {
      _id: reqUser.sub, // Mapear 'sub' a '_id'
      name: reqUser.name, // Asumiendo que el nombre está en el payload
      email: reqUser.email,
      role: reqUser.role,
      // Asegúrate de que todas las propiedades requeridas por UserDto estén aquí
    };

    console.log('CurrentUser decorator: User:', user);
    if (!user || !user._id) { // Verificar que _id exista
      throw new Error('Usuario no autenticado o ID de usuario no disponible');
    }
    return user;
  },
);
