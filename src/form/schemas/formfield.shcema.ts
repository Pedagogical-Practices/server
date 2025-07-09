import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importar ObjectType, Field, ID

@ObjectType() // Añadido
@Schema()
export class Option {
  @Field() // Añadido
  @Prop({ required: true })
  label: string;

  @Field() // Añadido
  @Prop({ required: true })
  value: string;
}

@ObjectType() // Añadido
@Schema()
export class FormField {
  @Field() // Añadido
  @Prop({ required: true })
  type: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  label: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  value: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  variableName: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  placeholder: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  hint: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  height: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  required: boolean;

  @Field({ nullable: true }) // Añadido
  @Prop()
  chapter: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  question: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  questionNumber: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  consistencyCondition: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  inconsistencyMessage: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  errorType: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  description: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  requirementLevel: string;

  @Field(() => [Option], { nullable: true }) // Añadido
  @Prop([Option]) // Cambiado de string[] a Option[]
  options: Option[];

  @Field({ nullable: true }) // Añadido
  @Prop()
  disabled: boolean;

  @Field({ nullable: true }) // Añadido
  @Prop()
  readonly: boolean;

  @Field({ nullable: true }) // Añadido
  @Prop()
  name: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  specificType: string;

  @Field({ nullable: true }) // Añadido
  @Prop()
  color: string;

  @Field(() => [String], { nullable: true }) // Añadido
  @Prop([String])
  rules: string[];

  @Field({ nullable: true }) // Añadido
  @Prop() // Añadido
  multiple: boolean;

  @Field({ nullable: true }) // Añadido
  @Prop() // Añadido
  dataSource: string;
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
