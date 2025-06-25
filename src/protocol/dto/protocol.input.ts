// protocol.input.ts
import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class CreateProtocolInput {
  @Field(() => ID)
  courseId: string;

  @Field()
  name: string;

  @Field()
  module: string;

  @Field(() => ID)
  formId: string;
}

@InputType()
export class UpdateProtocolInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  courseId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  module?: string;

  @Field(() => ID, { nullable: true })
  formId?: string;
}

@InputType()
export class CreateAttendanceRecordInput {
  @Field(() => ID)
  protocolId: string;

  @Field()
  week: string;

  @Field()
  date: string;

  @Field()
  topic: string;

  @Field(() => Int)
  hours: number;

  @Field()
  group: string;

  @Field()
  classType: string;

  @Field({ nullable: true })
  other?: string;

  @Field()
  advisorSignature: string;

  @Field()
  tutorSignature: string;

  @Field({ nullable: true })
  observations?: string;
}
