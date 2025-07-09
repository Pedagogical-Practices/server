import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Institution extends Document {
  @Field(() => ID)
  declare _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  address: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  phone: string;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);