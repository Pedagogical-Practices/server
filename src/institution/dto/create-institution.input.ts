import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateInstitutionInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  email?: string;
}
