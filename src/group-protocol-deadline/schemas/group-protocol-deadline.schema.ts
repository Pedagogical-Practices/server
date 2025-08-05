import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Group } from '../../group/schemas/group.schema';
import { Protocol } from '../../protocol/schemas/protocol.schema';

@ObjectType()
@Schema({ timestamps: true })
export class GroupProtocolDeadline extends Document {
  @Field(() => ID)
  declare id: string;

  @Field(() => Group)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId | Group;

  @Field(() => Protocol)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Protocol', required: true })
  protocol: Types.ObjectId | Protocol;

  @Field({ nullable: true })
  @Prop({ required: false })
  startDate?: Date;

  @Field()
  @Prop({ required: true })
  endDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const GroupProtocolDeadlineSchema = SchemaFactory.createForClass(GroupProtocolDeadline);
