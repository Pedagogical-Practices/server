// submission.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
  ) {}

  async create(
    createSubmissionInput: CreateSubmissionInput,
    userId: string,
  ): Promise<Submission> {
    const submission = new this.submissionModel({
      ...createSubmissionInput,
      submittedBy: userId,
    });
    return submission.save();
  }

  async update(
    updateSubmissionInput: UpdateSubmissionInput,
    userId: string,
  ): Promise<Submission | null> {
    const { id, ...updateData } = updateSubmissionInput;
    return this.submissionModel
      .findByIdAndUpdate(
        id,
        { ...updateData, submittedBy: userId },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.submissionModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByProtocol(protocolId: string): Promise<Submission[]> {
    return this.submissionModel.find({ protocolId }).exec();
  }

  async findOne(id: string): Promise<Submission | null> {
    return this.submissionModel.findById(id).exec();
  }
}
