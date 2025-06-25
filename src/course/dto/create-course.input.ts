import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;

  @Field()
  institution: string;

  @Field(() => [String])
  assignedGroups: string[];
}
