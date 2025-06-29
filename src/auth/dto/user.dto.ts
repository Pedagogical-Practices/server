import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserDto {
  @Field(() => ID)
  sub: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;
}
