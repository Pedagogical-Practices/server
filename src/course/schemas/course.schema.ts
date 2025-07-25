import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Protocol } from '../../protocol/schemas/protocol.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Course extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  description: string;

  @Field()
  @Prop({ required: true })
  startDate: Date;

  @Field()
  @Prop({ required: true })
  endDate: Date;

  @Field(() => [Protocol], { nullable: true })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Protocol' }] })
  protocols: Types.ObjectId[] | Protocol[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);