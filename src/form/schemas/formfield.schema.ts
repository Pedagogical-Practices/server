import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Schema()
export class FormField {
  @Field(() => ID)
  @Prop()
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  label: string;

  @Field()
  @Prop({ required: true })
  type: string; // e.g., 'text', 'select', 'checkbox'

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object })
  options: Record<string, any>; // For select, radio, etc.

  @Field({ nullable: true })
  @Prop()
  defaultValue: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object })
  rules: Record<string, any>; // Validation rules
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
