import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateGroupInput {
  @Field()
  name: string;

  @Field()
  period: string;

  @Field(() => ID)
  practiceId: string;

  @Field(() => ID)
  tutorId: string;

  @Field(() => [ID])
  studentIds: string[];

  @Field(() => [ID])
  institutionIds: string[];
}
