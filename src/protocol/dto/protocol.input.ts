// protocol.input.ts
import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class CreateProtocolInput {
  @Field()
  name: string;

  @Field()
  module: string;

  @Field(() => [ID]) // Ahora es un array de IDs
  formIds: string[]; // Cambiado de formId a formIds
}

@InputType()
export class UpdateProtocolInput {
  @Field(() => ID)
  id: string;

  // @Field(() => ID, { nullable: true })
  // courseId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  module?: string;

  @Field(() => [ID], { nullable: true }) // Ahora es un array de IDs, opcional para actualización
  formIds?: string[]; // Cambiado de formId a formIds
}

// CreateAttendanceRecordInput se mantiene sin cambios
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
