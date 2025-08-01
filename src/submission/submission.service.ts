import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { Practice } from '../practice/schemas/practice.schema';
import { Protocol } from '../protocol/schemas/protocol.schema';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(Protocol.name) private protocolModel: Model<Protocol>,
  ) {}

  async create(createSubmissionInput: CreateSubmissionInput): Promise<Submission> {
    const submission = new this.submissionModel({
      practice: new Types.ObjectId(createSubmissionInput.practiceId),
      protocol: new Types.ObjectId(createSubmissionInput.protocolId),
      formData: createSubmissionInput.formData,
      locationData: createSubmissionInput.locationData,
    });
    return submission.save();
  }

  async update(id: string, updateSubmissionInput: UpdateSubmissionInput): Promise<Submission> {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    if (updateSubmissionInput.formData) {
      submission.formData = updateSubmissionInput.formData;
    }
    if (updateSubmissionInput.locationData) {
      submission.locationData = updateSubmissionInput.locationData;
    }
    if (updateSubmissionInput.score) {
      submission.score = updateSubmissionInput.score;
    }
    if (updateSubmissionInput.feedback) {
      submission.feedback = updateSubmissionInput.feedback;
    }

    return submission.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.submissionModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findOne(id: string): Promise<Submission | null> {
    return this.submissionModel
      .findById(id)
      .populate('practice')
      .populate('protocol')
      .exec();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel
      .find()
      .populate('practice')
      .populate('protocol')
      .exec();
  }

  async findManyByIds(ids: string[]): Promise<Submission[]> {
    return this.submissionModel.find({ _id: { $in: ids } }).exec();
  }

  async evaluateSubmission(id: string, score: number, feedback: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.score = score;
    submission.feedback = feedback;

    return submission.save();
  }
}