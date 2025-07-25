import { InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class UpdateSubmissionInput {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON, { nullable: true })
  formData?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  locationData?: any;

  @Field({ nullable: true })
  score?: number;

  @Field({ nullable: true })
  feedback?: string;
}
