import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput } from './dto/create-practice.input';
import { UpdatePracticeInput } from './dto/update-practice.input';
import { Protocol } from '../protocol/schemas/protocol.schema';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(Practice.name) private readonly practiceModel: Model<Practice>,
    @InjectModel(Protocol.name) private readonly protocolModel: Model<Protocol>,
  ) {}

  async create(createPracticeInput: CreatePracticeInput): Promise<Practice> {
    const newPractice = new this.practiceModel(createPracticeInput);
    if (createPracticeInput.protocols && createPracticeInput.protocols.length > 0) {
      const protocols = await this.protocolModel.find({ _id: { $in: createPracticeInput.protocols } });
      if (protocols.length !== createPracticeInput.protocols.length) {
        throw new NotFoundException('One or more protocols not found');
      }
      newPractice.protocols = protocols.map(p => p._id as Types.ObjectId);
    }
    return newPractice.save();
  }

  async findAll(): Promise<Practice[]> {
    return this.practiceModel.find().populate('protocols').exec();
  }

  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceModel.findById(id).populate('protocols').exec();
    if (!practice) {
      throw new NotFoundException(`Practice with ID ${id} not found`);
    }
    return practice;
  }

  async update(id: string, updatePracticeInput: UpdatePracticeInput): Promise<Practice> {
    const existingPractice = await this.practiceModel.findById(id);
    if (!existingPractice) {
      throw new NotFoundException(`Practice with ID ${id} not found`);
    }

    if (updatePracticeInput.protocols) {
      const protocols = await this.protocolModel.find({ _id: { $in: updatePracticeInput.protocols } });
      if (protocols.length !== updatePracticeInput.protocols.length) {
        throw new NotFoundException('One or more protocols not found');
      }
      existingPractice.protocols = protocols.map(p => p._id as Types.ObjectId);
    }

    existingPractice.set(updatePracticeInput);
    return existingPractice.save();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.practiceModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
