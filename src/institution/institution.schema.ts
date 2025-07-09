import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Institution extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);
