import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field(() => [ID], { nullable: true })
  protocolIds?: string[];
}
