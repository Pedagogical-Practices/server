import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GroupProtocolDeadline } from './schemas/group-protocol-deadline.schema';
import { CreateGroupProtocolDeadlineInput } from './dto/create-group-protocol-deadline.input';
import { UpdateGroupProtocolDeadlineInput } from './dto/update-group-protocol-deadline.input';

@Injectable()
export class GroupProtocolDeadlineService {
  constructor(
    @InjectModel(GroupProtocolDeadline.name) private groupProtocolDeadlineModel: Model<GroupProtocolDeadline>,
  ) {}

  async create(input: CreateGroupProtocolDeadlineInput): Promise<GroupProtocolDeadline> {
    const created = new this.groupProtocolDeadlineModel({
      ...input,
      group: new Types.ObjectId(input.groupId),
      protocol: new Types.ObjectId(input.protocolId),
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: new Date(input.endDate),
    });
    return created.save();
  }

  async findAll(): Promise<GroupProtocolDeadline[]> {
    return this.groupProtocolDeadlineModel.find().exec();
  }

  async findOne(id: string): Promise<GroupProtocolDeadline | null> {
    return this.groupProtocolDeadlineModel.findById(id).exec();
  }

  async update(id: string, input: UpdateGroupProtocolDeadlineInput): Promise<GroupProtocolDeadline> {
    const deadline = await this.groupProtocolDeadlineModel.findById(id);

    if (!deadline) {
      throw new NotFoundException(`GroupProtocolDeadline with ID ${id} not found`);
    }

    if (input.startDate) {
      deadline.startDate = new Date(input.startDate);
    }
    if (input.endDate) {
      deadline.endDate = new Date(input.endDate);
    }

    return deadline.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.groupProtocolDeadlineModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findManyByGroupAndProtocol(groupId: string, protocolId: string): Promise<GroupProtocolDeadline[]> {
    return this.groupProtocolDeadlineModel.find({ group: new Types.ObjectId(groupId), protocol: new Types.ObjectId(protocolId) }).exec();
  }

  async findManyByGroup(groupId: string): Promise<GroupProtocolDeadline[]> {
    return this.groupProtocolDeadlineModel.find({ group: new Types.ObjectId(groupId) }).exec();
  }
}
