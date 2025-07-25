import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Protocol } from './schemas/protocol.schema';
import {
  CreateProtocolInput,
  UpdateProtocolInput,
} from './dto/protocol.input';

@Injectable()
export class ProtocolService {
  constructor(
    @InjectModel(Protocol.name) private protocolModel: Model<Protocol>,
  ) {}

  async create(createProtocolInput: CreateProtocolInput): Promise<Protocol> {
    const createdProtocol = new this.protocolModel({
      name: createProtocolInput.name,
      description: createProtocolInput.description,
      form: new Types.ObjectId(createProtocolInput.formId),
      productType: createProtocolInput.productType,
    });
    const savedProtocol = await createdProtocol.save();
    return savedProtocol.populate('form');
  }

  async update(id: string, updateProtocolInput: UpdateProtocolInput): Promise<Protocol> {
    const { formId, ...updateData } = updateProtocolInput;
    const protocol = await this.protocolModel.findById(id);

    if (!protocol) {
      throw new NotFoundException(`Protocol with ID ${id} not found`);
    }

    if (formId) {
      protocol.form = new Types.ObjectId(formId);
    }
    if (updateData.name) {
      protocol.name = updateData.name;
    }
    if (updateData.description) {
      protocol.description = updateData.description;
    }
    if (updateData.productType) {
      protocol.productType = updateData.productType;
    }

    return protocol.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.protocolModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findAll(): Promise<Protocol[]> {
    return this.protocolModel.find().populate('form').exec();
  }

  async findOne(id: string): Promise<Protocol | null> {
    return this.protocolModel.findById(id).populate('form').exec();
  }
}
