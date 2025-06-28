import { InputType, Field } from '@nestjs/graphql';
import { CreateAttendanceRecordInput } from './create-attendance-record.input';

@InputType()
export class GenerateAttendancePDFInput {
  @Field()
  teacherName: string;

  @Field()
  advisorName: string;

  @Field()
  institution: string;

  @Field()
  tutorName: string;

  @Field()
  assignedGroups: string;

  @Field(() => [CreateAttendanceRecordInput])
  records: CreateAttendanceRecordInput[];
}
