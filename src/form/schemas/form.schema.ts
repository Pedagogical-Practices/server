// ./src/form/schemas/form.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FormField } from './formfield.shcema';

@Schema({ timestamps: true })
export class Form extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [FormField], default: [] })
  fields: FormField[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const FormSchema = SchemaFactory.createForClass(Form);

FormSchema.index({ name: 1 });
