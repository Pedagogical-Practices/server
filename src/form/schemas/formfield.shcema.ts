import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { FormFieldType } from '../../common/enums/form-field-type.enum';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
@Schema()
export class FormField {
  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  label: string;

  @Field(() => FormFieldType)
  @Prop({ required: true, enum: Object.values(FormFieldType) })
  type: FormFieldType;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object, required: false })
  options: any;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], required: false })
  rules: string[];
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
