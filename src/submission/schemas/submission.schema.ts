import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { Group } from '../../group/schemas/group.schema';
import { User } from '../../auth/schemas/user.schema';
import { Protocol } from '../../protocol/schemas/protocol.schema';

@ObjectType()
@Schema({ timestamps: true })
export class Submission extends Document {
  @Field(() => ID)
  declare id: string;

  @Field(() => Group)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId | Group;

  @Field(() => Protocol)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Protocol',
    required: true,
  })
  protocol: Types.ObjectId | Protocol;

  @Field(() => [User])
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  students: Types.ObjectId[] | User[];

  @Field(() => GraphQLJSON)
  @Prop({ type: Object, required: true })
  formData: Record<string, any>;

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
