import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { Group } from '../group/schemas/group.schema';
import { User } from '../auth/schemas/user.schema';
import { Protocol } from '../protocol/schemas/protocol.schema';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Protocol.name) private protocolModel: Model<Protocol>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(
    createSubmissionInput: CreateSubmissionInput,
  ): Promise<Submission> {
    const submission = new this.submissionModel({
      group: new Types.ObjectId(createSubmissionInput.groupId),
      protocol: new Types.ObjectId(createSubmissionInput.protocolId),
      students: createSubmissionInput.studentIds.map(
        (id) => new Types.ObjectId(id),
      ),
      formData: createSubmissionInput.formData,
    });
    return submission.save();
  }

  async update(
    id: string,
    updateSubmissionInput: UpdateSubmissionInput,
  ): Promise<Submission> {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    if (updateSubmissionInput.formData) {
      submission.formData = updateSubmissionInput.formData;
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
      .populate('group')
      .populate('protocol')
      .populate('students')
      .exec();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel
      .find()
      .populate('group')
      .populate('protocol')
      .populate('students')
      .exec();
  }

  async findManyByIds(ids: string[]): Promise<Submission[]> {
    return this.submissionModel.find({ _id: { $in: ids } }).exec();
  }

  async evaluateSubmission(
    id: string,
    score: number,
    feedback: string,
  ): Promise<Submission> {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.score = score;
    submission.feedback = feedback;

    return submission.save();
  }

  async findByGroup(groupId: string): Promise<Submission[]> {
    return this.submissionModel.find({ group: new Types.ObjectId(groupId) }).populate('group').populate('protocol').populate('students').exec();
  }

  async findByStudent(studentId: string): Promise<Submission[]> {
    return this.submissionModel.find({ students: new Types.ObjectId(studentId) }).populate('group').populate('protocol').populate('students').exec();
  }
}
