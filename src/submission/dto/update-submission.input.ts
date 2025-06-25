// update-submission.input.ts
import { CreateSubmissionInput } from './create-submission.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateSubmissionInput extends PartialType(CreateSubmissionInput) {
  @Field(() => ID)
  id: string;
}
