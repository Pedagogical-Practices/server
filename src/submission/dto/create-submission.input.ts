import { InputType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateSubmissionInput {
  @Field(() => ID)
  practiceId: string;

  @Field(() => ID)
  protocolId: string;

  @Field(() => GraphQLJSON)
  formData: any;

  @Field(() => GraphQLJSON, { nullable: true })
  locationData?: any;
}
