// ./src/form/schemas/formfield.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FormField {
  @Prop({ required: true })
  type: string;

  @Prop()
  label: string;

  @Prop()
  value: string;

  @Prop()
  variableName: string;

  @Prop()
  placeholder: string;

  @Prop()
  hint: string;

  @Prop()
  height: string;

  @Prop()
  required: boolean;

  @Prop()
  chapter: string;

  @Prop()
  question: string;

  @Prop()
  questionNumber: string;

  @Prop()
  consistencyCondition: string;

  @Prop()
  inconsistencyMessage: string;

  @Prop()
  errorType: string;

  @Prop()
  description: string;

  @Prop()
  requirementLevel: string;

  @Prop()
  options: string[];

  @Prop()
  disabled: boolean;

  @Prop()
  readonly: boolean;

  @Prop()
  name: string;

  @Prop()
  specificType: string;

  @Prop()
  color: string;

  @Prop()
  rules: string[];
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
