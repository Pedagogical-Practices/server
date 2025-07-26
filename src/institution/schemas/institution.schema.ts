import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstitutionDocument = Institution & Document;

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
  id: string; // Virtual property for GraphQL ID

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  createdAt: Date; // Explicitly declare for TypeScript
  updatedAt: Date; // Explicitly declare for TypeScript
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);

// Define virtual for id
InstitutionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});