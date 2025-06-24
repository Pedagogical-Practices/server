// course.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Course extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  institution: string;

  @Field(() => [String])
  @Prop({ type: [String], required: true })
  assignedGroups: string[];

  @Field()
  @Prop({ required: true })
  createdBy: string;

  @Field()
  createdAt: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
