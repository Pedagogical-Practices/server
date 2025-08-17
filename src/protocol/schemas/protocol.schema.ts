import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Form } from '../../form/schemas/form.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Protocol {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field(() => [Form], { name: 'forms' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Form' }] })
  forms: Types.ObjectId[];

  @Field({ nullable: true })
  @Prop()
  productType?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type ProtocolDocument = Protocol & Document;
export const ProtocolSchema = SchemaFactory.createForClass(Protocol);

ProtocolSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
