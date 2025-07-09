import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Form } from '../../form/schemas/form.schema'; // Importar el esquema de Form
import { AttendanceRecord } from '../../attendance/schemas/attendance.schema'; // Asumiendo que attendance.schema.ts existe y es correcto

@ObjectType()
@Schema({ timestamps: true })
export class Protocol extends Document {
  @Field(() => ID)
  declare _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  module: string;

  @Field(() => [Form]) // Ahora es un array de Form
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Form' }], default: [] }) // Referencia a múltiples Forms
  forms: Form[]; // Cambiado de formId a forms

  @Field()
  @Prop({ required: true })
  createdBy: string;

  @Field()
  createdAt: string;

  @Field(() => [AttendanceRecord])
  @Prop({
    type: [{ type: Types.ObjectId, ref: 'AttendanceRecord' }],
    default: [],
  })
  attendanceRecords: AttendanceRecord[];
}

export const ProtocolSchema = SchemaFactory.createForClass(Protocol);
export type ProtocolDocument = Protocol & Document;
