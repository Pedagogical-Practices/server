import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Practice } from '../../practice/schemas/practice.schema';
import { User } from '../../auth/schemas/user.schema';
import { Institution } from '../../institution/schemas/institution.schema';
import { GroupProtocolDeadline } from '../../group-protocol-deadline/schemas/group-protocol-deadline.schema';

export type GroupDocument = Group & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Group extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  period: string;

  @Field(() => Practice)
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Practice',
    required: true,
  })
  practice: Types.ObjectId | Practice;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  tutor: Types.ObjectId | User;

  @Field(() => [User])
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  students: Types.ObjectId[] | User[];

  @Field(() => [Institution])
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Institution' }],
    required: true,
  })
  institutions: Types.ObjectId[] | Institution[];

  @Field(() => [GroupProtocolDeadline])
  @Prop({
    type: [
      { type: MongooseSchema.Types.ObjectId, ref: 'GroupProtocolDeadline' },
    ],
    default: [],
  })
  deadlines: Types.ObjectId[] | GroupProtocolDeadline[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

GroupSchema.virtual('id').get(function(this: GroupDocument) {
  return (this._id as Types.ObjectId).toHexString();
});
