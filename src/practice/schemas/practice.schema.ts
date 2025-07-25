import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../auth/schemas/user.schema';
import { Course } from '../../course/schemas/course.schema';
import { Protocol } from '../../protocol/schemas/protocol.schema';
import { Submission } from '../../submission/schemas/submission.schema';
import { PracticeStatus } from '../../common/enums/practice-status.enum';

@ObjectType()
@Schema({ timestamps: true })
export class Practice extends Document {
  @Field(() => ID)
  declare id: string;

  @Field(() => Course)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId | Course;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId | User;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  teacher: Types.ObjectId | User;

  @Field(() => PracticeStatus)
  @Prop({ type: String, enum: PracticeStatus, default: PracticeStatus.PENDING })
  status: PracticeStatus;

  @Field(() => [Protocol], { nullable: true })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Protocol' }], default: [] })
  protocols: Types.ObjectId[] | Protocol[];

  @Field(() => [Submission], { nullable: true })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Submission' }], default: [] })
  submissions: Types.ObjectId[] | Submission[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);