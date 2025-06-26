// course.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
// import { User } from '../../auth/schemas/user.schema';
import { UserDto } from '../../auth/dto/user.dto';

@ObjectType()
@Schema({ timestamps: true })
export class Course extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  institution: string;

  @Field(() => [String])
  @Prop({ type: [String], required: true })
  assignedGroups: string[];

  @Field(() => UserDto) // Cambiar a User en lugar de String
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Referencia a User
  createdBy: Types.ObjectId | UserDto;

  @Field()
  createdAt: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
