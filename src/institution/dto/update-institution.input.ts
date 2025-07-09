import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateInstitutionInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;
}
