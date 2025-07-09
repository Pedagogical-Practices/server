import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserDto } from '../../auth/dto/user.dto'; // Asumiendo que UserDto es el tipo de salida para User
import { Protocol } from '../../protocol/schemas/protocol.schema'; // Asumiendo que Protocol es el tipo de salida para Protocol
import { Form } from '../../form/schemas/form.schema'; // Asumiendo que Form es el tipo de salida para Form
import { Submission } from '../../submission/schemas/submission.schema'; // Asumiendo que Submission es el tipo de salida para Submission

@ObjectType()
export class FilledFormDto {
  @Field(() => ID)
  formId: string; // ID del formulario

  @Field(() => Form)
  form: Form; // Objeto Form populado

  @Field(() => ID, { nullable: true })
  submissionId?: string; // ID de la submission

  @Field(() => Submission, { nullable: true })
  submission?: Submission; // Objeto Submission populado
}

@ObjectType()
export class PracticeDto {
  @Field(() => ID)
  _id: string;

  @Field(() => UserDto)
  student: UserDto;

  @Field(() => UserDto)
  advisor: UserDto;

  @Field(() => Protocol)
  protocol: Protocol;

  @Field()
  institutionName: string;

  @Field()
  courseName: string;

  @Field()
  status: string;

  @Field(() => [FilledFormDto])
  filledForms: FilledFormDto[];

  @Field(() => UserDto)
  createdBy: UserDto;

  @Field()
  createdAt: string;
}