import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from './schemas/group.schema';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { User } from '../auth/schemas/user.schema';
import { Practice } from '../practice/schemas/practice.schema';
import { Institution } from '../institution/schemas/institution.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(Institution.name) private institutionModel: Model<Institution>,
  ) {}

  async create(createGroupInput: CreateGroupInput): Promise<Group> {
    const { practiceId, tutorId, studentIds, institutionIds, ...groupData } = createGroupInput;
    const createdGroup = new this.groupModel({
      ...groupData,
      practice: new Types.ObjectId(practiceId),
      tutor: new Types.ObjectId(tutorId),
      students: studentIds.map(id => new Types.ObjectId(id)),
      institutions: institutionIds.map(id => new Types.ObjectId(id)),
    });
    return createdGroup.save();
  }

  async update(
    id: string,
    updateGroupInput: UpdateGroupInput,
  ): Promise<Group> {
    const { practiceId, tutorId, studentIds, institutionIds, ...updateData } = updateGroupInput;
    const group = await this.groupModel.findById(id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    if (updateData.name) {
      group.name = updateData.name;
    }
    if (updateData.period) {
      group.period = updateData.period;
    }
    if (practiceId) {
      group.practice = new Types.ObjectId(practiceId);
    }
    if (tutorId) {
      group.tutor = new Types.ObjectId(tutorId);
    }
    if (studentIds) {
      group.students = studentIds.map(id => new Types.ObjectId(id));
    }
    if (institutionIds) {
      group.institutions = institutionIds.map(id => new Types.ObjectId(id));
    }

    return group.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.groupModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find()
      .populate('practice')
      .populate('tutor')
      .populate('students')
      .populate('institutions')
      .exec();
  }

  async findOne(id: string): Promise<Group | null> {
    return this.groupModel.findById(id)
      .populate('practice')
      .populate('tutor')
      .populate('students')
      .populate('institutions')
      .exec();
  }

  async findGroupsByTutor(tutorId: string): Promise<Group[]> {
    return this.groupModel.find({ tutor: new Types.ObjectId(tutorId) }).exec();
  }

  async findGroupsByStudent(studentId: string): Promise<Group[]> {
    return this.groupModel.find({ students: new Types.ObjectId(studentId) }).exec();
  }
}
