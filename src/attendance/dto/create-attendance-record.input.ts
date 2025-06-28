import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAttendanceRecordInput {
  @Field(() => String) // Cambiar de ID a String
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

  @Field({ nullable: true })
  observations?: string;

  @Field()
  advisorSignature: string;

  @Field()
  tutorSignature: string;
}
