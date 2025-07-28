import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Institution {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
