import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    const createdProtocol = new this.protocolModel({
      name: createProtocolInput.name,
      module: createProtocolInput.module,
      forms: createProtocolInput.formIds,
      createdBy: userId,
    });
    const savedProtocol = await createdProtocol.save();
    return savedProtocol.populate('forms');
  }

  async update(
    updateProtocolInput: UpdateProtocolInput,
    userId: string,
  ): Promise<Protocol | null> {
    const { id, ...updateData } = updateProtocolInput;
    const protocol = await this.protocolModel.findById(id).exec();

    if (!protocol || protocol.createdBy !== userId) {
      throw new NotFoundException('No autorizado o protocolo no encontrado');
    }

    if (updateData.formIds !== undefined) {
      (updateData as any).forms = updateData.formIds;
      delete updateData.formIds;
    }

    const updatedProtocol = await this.protocolModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('forms')
      .exec();

    return updatedProtocol;
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
      throw new NotFoundException('No autorizado o protocolo no encontrado');
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

  async findAll(): Promise<Protocol[]> {
    return this.protocolModel.find().populate('forms').exec();
  }

  async findOne(id: string): Promise<Protocol | null> {
    return this.protocolModel.findById(id).populate('forms').exec();
  }

  async countProtocols(): Promise<number> {
    return this.protocolModel.countDocuments().exec();
  }
}
