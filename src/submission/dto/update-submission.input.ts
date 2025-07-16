import { CreateSubmissionInput } from './create-submission.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, ID, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class UpdateSubmissionInput extends PartialType(CreateSubmissionInput) {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  data?: Record<string, any>;
}
