import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

export type InstitutionDocument = Institution & Document;

@ObjectType()
@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
  toObject: {
    getters: true,
    virtuals: true,
  },
})
export class Institution {
  @Field(() => ID)
  declare id: string; // Virtual property for GraphQL ID

  @Field()
  @Prop({ required: true, unique: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  address: string;

  @Field({ nullable: true })
  @Prop()
  phone: string;

  @Field({ nullable: true })
  @Prop()
  email: string;

  @Field(() => Date)
  createdAt: Date; // Explicitly declare for TypeScript
  @Field(() => Date)
  updatedAt: Date; // Explicitly declare for TypeScript
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);

// Define virtual for id
InstitutionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});