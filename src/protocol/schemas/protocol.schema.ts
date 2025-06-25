// src/protocol/schemas/protocol.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class AttendanceRecord {
  @Field()
  week: string;

  @Field()
  date: string;

  @Field()
  topic: string;

  @Field(() => Int)
  hours: number;

  @Field()
  group: string;

  @Field()
  classType: string;

  @Field({ nullable: true })
  other?: string;

  @Field()
  advisorSignature: string;

  @Field()
  tutorSignature: string;

  @Field({ nullable: true })
  observations?: string;
}

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

  @Field(() => [AttendanceRecord])
  @Prop({ type: [Object], default: [] })
  attendanceRecords: AttendanceRecord[];
}

export const ProtocolSchema = SchemaFactory.createForClass(Protocol);
