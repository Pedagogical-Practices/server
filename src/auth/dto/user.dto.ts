import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  _id: string; // Cambiado de 'sub' a '_id'

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  // @Field() // Eliminado: No exponer la contraseña
  // password: string;
}
