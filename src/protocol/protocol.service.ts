import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Protocol } from './schemas/protocol.schema';
import { CreateProtocolInput, UpdateProtocolInput } from './dto/protocol.input';

@Injectable()
export class ProtocolService {
  constructor(
    @InjectModel(Protocol.name) private protocolModel: Model<Protocol>,
  ) {}

  async create(createProtocolInput: CreateProtocolInput): Promise<Protocol> {
    const newProtocolData = {
      ...createProtocolInput,
      forms: createProtocolInput.formIds.map((id) => new Types.ObjectId(id)),
    };
    const createdProtocol = new this.protocolModel(newProtocolData);
    return createdProtocol.save();
  }

  async update(
    id: string,
    updateProtocolInput: UpdateProtocolInput,
  ): Promise<Protocol> {
    const updatePayload: any = { ...updateProtocolInput };

    if (updateProtocolInput.formIds) {
      updatePayload.forms = updateProtocolInput.formIds.map(
        (id) => new Types.ObjectId(id),
      );
      delete updatePayload.formIds; // Prevent formIds from being added
    }

    const updatedProtocol = await this.protocolModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .exec();

    if (!updatedProtocol) {
      throw new NotFoundException(`Protocol with ID ${id} not found`);
    }

    return updatedProtocol;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.protocolModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findAll(): Promise<Protocol[]> {
    return this.protocolModel.find().exec();
  }

  async findOne(id: string): Promise<Protocol | null> {
    return this.protocolModel.findById(id).exec();
  }

  async findManyByIds(ids: string[]): Promise<Protocol[]> {
    return this.protocolModel.find({ _id: { $in: ids } }).exec();
  }
}
