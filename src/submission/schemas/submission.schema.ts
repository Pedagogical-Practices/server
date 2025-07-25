import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Practice } from '../../practice/schemas/practice.schema';
import { Protocol } from '../../protocol/schemas/protocol.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Submission extends Document {
  @Field(() => ID)
  declare id: string;

  @Field(() => Practice)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Practice', required: true })
  practice: Types.ObjectId | Practice;

  @Field(() => Protocol)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Protocol', required: true })
  protocol: Types.ObjectId | Protocol;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object, required: true })
  formData: Record<string, any>;

  @Field(() => GraphQLJSON, { nullable: true })
  @Prop({ type: Object, required: false })
  locationData: Record<string, any>;

  @Field({ nullable: true })
  @Prop({ required: false })
  score: number;

  @Field({ nullable: true })
  @Prop({ required: false })
  feedback: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
