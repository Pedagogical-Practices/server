import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql'; // Importar ObjectType, Field, ID
import { FormField } from './formfield.shcema'; // Asegurarse de que FormField sea un ObjectType

@ObjectType() // Añadido
@Schema({ timestamps: true })
export class Form extends Document {
  @Field(() => ID) // Añadido
  declare _id: Types.ObjectId;

  @Field() // Añadido
  @Prop({ required: true })
  name: string;

  @Field(() => [FormField]) // Añadido, asumiendo que FormField es un ObjectType
  @Prop({ type: [FormField], default: [] })
  fields: FormField[];

  @Field(() => ID) // Añadido, asumiendo que User es un ObjectType
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId; // O User si se popula

  @Field() // Añadido
  createdAt: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);

FormSchema.index({ name: 1 });
