import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { Group } from '../group/schemas/group.schema';
import { User } from '../auth/schemas/user.schema';
import { Protocol } from '../protocol/schemas/protocol.schema';
import { GroupProtocolDeadlineService } from '../group-protocol-deadline/group-protocol-deadline.service';
import { SubmissionStatus } from '../common/enums/submission-status.enum';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Protocol.name) private protocolModel: Model<Protocol>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly groupProtocolDeadlineService: GroupProtocolDeadlineService,
  ) {}

  async create(
    createSubmissionInput: CreateSubmissionInput,
  ): Promise<Submission> {
    const { groupId, protocolId } = createSubmissionInput;

    // Deadline validation logic
    const deadlines = await this.groupProtocolDeadlineService.findManyByGroupAndProtocol(groupId, protocolId);
    if (deadlines && deadlines.length > 0) {
      const deadline = deadlines[0]; // Assume the first one is the relevant one
      if (new Date() > deadline.endDate) {
        throw new ForbiddenException('The deadline for this submission has passed.');
      }
    }

    const submission = new this.submissionModel({
      group: new Types.ObjectId(groupId),
      protocol: new Types.ObjectId(protocolId),
      form: new Types.ObjectId(createSubmissionInput.formId),
      students: createSubmissionInput.studentIds.map(
        (id) => new Types.ObjectId(id),
      ),
      formData: createSubmissionInput.formData,
    });
    const createdSubmission = await submission.save();

    // Explicitly populate and convert to plain object with string IDs
    const populatedSubmission = await this.submissionModel.findById(createdSubmission._id)
      .populate({
        path: 'group',
        options: { getters: true, virtuals: true }
      })
      .populate({
        path: 'protocol',
        options: { getters: true, virtuals: true }
      })
      .populate({
        path: 'form',
        options: { getters: true, virtuals: true }
      })
      .populate({
        path: 'students',
        options: { getters: true, virtuals: true }
      })
      .exec();

    if (!populatedSubmission) {
      throw new Error("Failed to retrieve created submission with populated fields.");
    }

    // Convert the fully populated document to a plain object, applying all getters/virtuals
    const finalSubmissionObject = populatedSubmission.toObject({ getters: true, virtuals: true });

    // Ensure the main submission ID is also a string (redundant but safe)
    finalSubmissionObject.id = (populatedSubmission._id as Types.ObjectId).toString();

    return finalSubmissionObject;
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
      .populate('protocol').populate('form')
      .populate('students')
      .exec();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel
      .find()
      .populate('group')
      .populate('protocol').populate('form')
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
    status: SubmissionStatus,
  ): Promise<Submission> {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.evaluationStatus = status;

    return submission.save();
  }

  async findByGroup(groupId: string): Promise<Submission[]> {
    return this.submissionModel.find({ group: new Types.ObjectId(groupId) }).populate('group').populate('protocol').populate('form').populate('students').exec();
  }

  async findByStudent(studentId: string): Promise<Submission[]> {
    return this.submissionModel.find({ students: new Types.ObjectId(studentId) }).populate('group').populate('protocol').populate('form').populate('students').exec();
  }

  async findByStudentAndGroup(studentId: string, groupId: string): Promise<Submission[]> {
    return this.submissionModel
      .find({
        students: new Types.ObjectId(studentId),
        group: new Types.ObjectId(groupId),
      })
      .populate('group')
      .populate('protocol').populate('form')
      .populate('students')
      .exec();
  }

  async findByFormAndGroup(groupId: string, formId: string): Promise<Submission[]> {
    return this.submissionModel
      .find({
        group: new Types.ObjectId(groupId),
        form: new Types.ObjectId(formId),
      })
      .populate('group')
      .populate('protocol')
      .populate('form')
      .populate('students')
      .sort({ createdAt: -1 })
      .exec();
  }
}
