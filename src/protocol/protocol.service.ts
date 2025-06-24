// protocol.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Protocol } from './schemas/protocol.schema';
import { CreateProtocolInput } from './dto/create-protocol.input';
import { UpdateProtocolInput } from './dto/update-protocol.input';

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
    return this.protocolModel
      .findByIdAndUpdate(
        id,
        { ...updateData, createdBy: userId },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.protocolModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByCourse(courseId: string): Promise<Protocol[]> {
    return this.protocolModel.find({ courseId }).exec();
  }

  async findOne(id: string): Promise<Protocol | null> {
    return this.protocolModel.findById(id).exec();
  }
}
