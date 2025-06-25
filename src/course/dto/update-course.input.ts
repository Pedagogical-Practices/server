// update-course.input.ts
import { CreateCourseInput } from './create-course.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => ID)
  id: string;
}
