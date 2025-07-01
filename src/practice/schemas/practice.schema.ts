import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../../auth/schemas/user.schema';
import { Protocol } from '../../protocol/schemas/protocol.schema';
import { Form } from '../../form/schemas/form.schema';
import { Submission } from '../../submission/schemas/submission.schema';

export enum PracticeStatus {
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
}

registerEnumType(PracticeStatus, {
  name: 'PracticeStatus',
});

@ObjectType()
@Schema({ timestamps: true })
export class FilledForm {
  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Form', required: true })
  form: Types.ObjectId; // Referencia al Formulario del Protocolo

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Submission', default: null })
  submission?: Types.ObjectId; // Referencia a la Submission cuando el formulario ha sido llenado
}
export const FilledFormSchema = SchemaFactory.createForClass(FilledForm);


@ObjectType()
@Schema({ timestamps: true })
export class Practice extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId; // Referencia al estudiante

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  advisor: Types.ObjectId; // Referencia al docente asesor

  @Field(() => Protocol)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Protocol', required: true })
  protocol: Types.ObjectId; // Referencia al protocolo asignado

  @Field()
  @Prop({ required: true })
  institutionName: string; // Nombre de la institución

  @Field()
  @Prop({ required: true })
  courseName: string; // Nombre del curso/grado

  @Field(() => PracticeStatus)
  @Prop({ type: String, enum: PracticeStatus, default: PracticeStatus.ASSIGNED })
  status: PracticeStatus; // Estado de la práctica

  @Field(() => [FilledForm])
  @Prop({ type: [FilledFormSchema], default: [] })
  filledForms: FilledForm[]; // Array de formularios llenados y sus submissions

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // Usuario que creó la asignación

  @Field({ nullable: true })
  @Prop({ required: false }) // Hacerlo opcional por ahora
  dueDate?: string; // Fecha de entrega o finalización de la práctica

  @Field()
  createdAt: string;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);