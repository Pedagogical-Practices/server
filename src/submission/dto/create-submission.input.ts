import { InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateSubmissionInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  protocolId: string;

  @Field(() => ID)
  formId: string;

  @Field(() => [ID])
  studentIds: string[];

  @Field(() => GraphQLJSON)
  formData: any;
}