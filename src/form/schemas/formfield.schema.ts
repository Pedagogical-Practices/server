import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Schema()
export class FormField {
  @Field(() => ID, { nullable: true })
  @Prop()
  id?: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  label: string;

  @Field()
  @Prop({ required: true })
  type: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object })
  options: Record<string, any>;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String] })
  rules: string[];

  @Field({ nullable: true })
  @Prop({ required: false })
  defaultValue: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  value: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  variableName: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  hint: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  required: boolean;

  @Field({ nullable: true })
  @Prop({ required: false })
  chapter: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  question: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  questionNumber: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  consistencyCondition: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  inconsistencyMessage: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  errorType: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  description: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  disabled: boolean;

  @Field({ nullable: true })
  @Prop({ required: false })
  readonly: boolean;

  @Field({ nullable: true })
  @Prop({ required: false })
  dataSource: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  placeholder: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  specificType: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  height: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  multiple: boolean;
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
