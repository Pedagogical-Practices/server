import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Form } from '../../form/schemas/form.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Protocol extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  description: string;

  @Field(() => Form)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Form', required: true })
  form: Types.ObjectId | Form;

  @Field({ nullable: true })
  @Prop({ required: false })
  productType: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ProtocolSchema = SchemaFactory.createForClass(Protocol);
export type ProtocolDocument = Protocol & Document;
