import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { FormField } from './formfield.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Form extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  description: string;

  @Field(() => [FormField])
  @Prop({ type: [FormField], default: [] })
  fields: FormField[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Number)
  @Prop({ required: true, default: 1 })
  version: number;

  @Field(() => Form, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Form', nullable: true })
  parentForm?: Types.ObjectId | Form;
}

export const FormSchema = SchemaFactory.createForClass(Form);

FormSchema.index({ name: 1 });
