import { InputType, Field, ID } from '@nestjs/graphql';
import { PracticeStatus } from '../../common/enums/practice-status.enum';

@InputType()
export class CreatePracticeInput {
  @Field(() => ID)
  courseId: string;

  @Field(() => ID)
  studentId: string;

  @Field(() => ID)
  teacherId: string;

  @Field(() => PracticeStatus, { nullable: true })
  status?: PracticeStatus;

  @Field(() => [ID], { nullable: true })
  protocolIds?: string[];
}

@InputType()
export class UpdatePracticeInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  courseId?: string;

  @Field(() => ID, { nullable: true })
  studentId?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: string;

  @Field(() => PracticeStatus, { nullable: true })
  status?: PracticeStatus;

  @Field(() => [ID], { nullable: true })
  protocolIds?: string[];
}