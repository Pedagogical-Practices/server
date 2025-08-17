import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../../common/enums/user-role.enum';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field({ nullable: true })
  @Prop()
  middleName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field({ nullable: true })
  @Prop()
  secondLastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => [UserRole])
  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: [UserRole.VISITOR],
    type: [String],
  })
  roles: UserRole[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function(this: UserDocument) {
  return (this._id as Types.ObjectId).toHexString();
});
