// create-submission.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateSubmissionInput {
  @Field(() => ID)
  protocolId: string;

  @Field(() => ID)
  formId: string;

  @Field(() => GraphQLJSON)
  data: any;
}
