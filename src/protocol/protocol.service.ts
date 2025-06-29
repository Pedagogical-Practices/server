import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Agregar Types
import { Protocol } from './schemas/protocol.schema';
import { AttendanceRecord } from '../attendance/schemas/attendance.schema';
import {
  CreateProtocolInput,
  UpdateProtocolInput,
  CreateAttendanceRecordInput,
} from './dto/protocol.input';

@Injectable()
export class ProtocolService {
  constructor(
    @InjectModel(Protocol.name) private protocolModel: Model<Protocol>,
  ) {}

  async create(
    createProtocolInput: CreateProtocolInput,
    userId: string,
  ): Promise<Protocol> {
    const protocol = new this.protocolModel({
      ...createProtocolInput,
      createdBy: userId,
    });
    return protocol.save();
  }

  async update(
    updateProtocolInput: UpdateProtocolInput,
    userId: string,
  ): Promise<Protocol | null> {
    const { id, ...updateData } = updateProtocolInput;
    const protocol = await this.protocolModel.findById(id).exec();
    if (!protocol || protocol.createdBy !== userId) {
      throw new Error('No autorizado o protocolo no encontrado');
    }
    return this.protocolModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.protocolModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async createAttendanceRecord(
    createAttendanceRecordInput: CreateAttendanceRecordInput,
    userId: string,
  ): Promise<AttendanceRecord> {
    const protocol = await this.protocolModel
      .findById(createAttendanceRecordInput.protocolId)
      .exec();
    if (!protocol || protocol.createdBy !== userId) {
      throw new Error('No autorizado o protocolo no encontrado');
    }
    const newRecord: AttendanceRecord = {
      ...createAttendanceRecordInput,
      _id: new Types.ObjectId(),
      submittedBy: userId,
      createdAt: new Date().toISOString(),
    } as AttendanceRecord;
    protocol.attendanceRecords.push(newRecord);
    await protocol.save();
    return protocol.attendanceRecords[protocol.attendanceRecords.length - 1];
  }

  async findByCourse(courseId: string): Promise<Protocol[]> {
    return this.protocolModel.find({ courseId }).exec();
  }

  async findOne(id: string): Promise<Protocol | null> {
    return this.protocolModel.findById(id).exec();
  }
}
