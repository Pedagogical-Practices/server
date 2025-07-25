import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../schemas/user.schema';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}
