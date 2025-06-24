// protocol.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Protocol extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: String, required: true })
  courseId: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  module: string;

  @Field(() => ID)
  @Prop({ type: String, required: true })
  formId: string;

  @Field()
  @Prop({ required: true })
  createdBy: string;

  @Field()
  createdAt: string;
}

export const ProtocolSchema = SchemaFactory.createForClass(Protocol);
