// submission.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Schema({ timestamps: true })
export class Submission extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: String, ref: 'Protocol', required: true })
  protocolId: string;

  @Field(() => ID)
  @Prop({ type: String, ref: 'Form', required: true })
  formId: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object, required: true })
  data: Record<string, any>;

  @Field()
  @Prop({ required: true })
  submittedBy: string;

  @Field()
  createdAt: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
