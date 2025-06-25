// src/protocol/protocol.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Protocol, AttendanceRecord } from './schemas/protocol.schema';
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
    protocol.attendanceRecords.push(createAttendanceRecordInput);
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
