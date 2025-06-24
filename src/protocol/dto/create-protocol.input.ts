import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateProtocolInput {
  @Field(() => ID)
  courseId: string;

  @Field()
  name: string;

  @Field()
  module: string;

  @Field(() => ID)
  formId: string;
}
