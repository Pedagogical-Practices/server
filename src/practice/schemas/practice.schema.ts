import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Protocol } from '../../protocol/schemas/protocol.schema';

@ObjectType()
@Schema({
  timestamps: true,
  collection: 'practices',
})
export class Practice extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field(() => [Protocol])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Protocol' }] })
  protocols: Types.ObjectId[];
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);
