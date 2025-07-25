import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateProtocolInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  formId: string;

  @Field({ nullable: true })
  productType?: string;
}

@InputType()
export class UpdateProtocolInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  formId?: string;

  @Field({ nullable: true })
  productType?: string;
}
