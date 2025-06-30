import { InputType, Field, ID } from '@nestjs/graphql';
import { PracticeStatus } from '../schemas/practice.schema'; // Importar el enum de estados

@InputType()
export class CreatePracticeInput {
  @Field(() => ID)
  studentId: string;

  @Field(() => ID)
  advisorId: string;

  @Field(() => ID)
  protocolId: string;

  @Field()
  institutionName: string;

  @Field()
  courseName: string;
}

@InputType()
export class UpdatePracticeInput {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  studentId?: string;

  @Field(() => ID, { nullable: true })
  advisorId?: string;

  @Field(() => ID, { nullable: true })
  protocolId?: string;

  @Field({ nullable: true })
  institutionName?: string;

  @Field({ nullable: true })
  courseName?: string;

  @Field(() => PracticeStatus, { nullable: true }) // Usar el enum de estados
  status?: PracticeStatus;
}