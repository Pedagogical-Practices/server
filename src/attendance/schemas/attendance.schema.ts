import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class AttendanceRecord extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field()
  @Prop({ type: String, required: true })
  week: string;

  @Field()
  @Prop({ type: String, required: true })
  date: string;

  @Field()
  @Prop({ type: String, required: true })
  topic: string;

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  hours: number;

  @Field()
  @Prop({ type: String, required: true })
  group: string;

  @Field()
  @Prop({ type: String, required: true })
  classType: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  other: string;

  @Field({ nullable: true })
  @Prop({ type: String })
  observations: string;

  @Field()
  @Prop({ type: String, required: true })
  advisorSignature: string;

  @Field()
  @Prop({ type: String, required: true })
  tutorSignature: string;

  @Field()
  @Prop({ type: String, required: true })
  protocolId: string;

  @Field()
  @Prop({ type: String, required: true })
  submittedBy: string;

  @Field()
  createdAt: string;
}

export const AttendanceRecordSchema =
  SchemaFactory.createForClass(AttendanceRecord);
