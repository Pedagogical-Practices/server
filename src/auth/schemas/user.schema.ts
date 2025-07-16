import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRoles } from '../roles.decorator';

@ObjectType()
@Schema()
export class User extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({
    required: true,
    enum: Object.values(UserRoles),
    default: UserRoles.STUDENT,
  })
  role: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  studentId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
