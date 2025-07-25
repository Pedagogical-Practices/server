import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createPracticeInput: CreatePracticeInput): Promise<Practice> {
    const { protocolIds, ...practiceData } = createPracticeInput;
    const createdPractice = new this.practiceModel({
      ...practiceData,
      course: new Types.ObjectId(practiceData.courseId),
      student: new Types.ObjectId(practiceData.studentId),
      teacher: new Types.ObjectId(practiceData.teacherId),
      protocols: protocolIds ? protocolIds.map(id => new Types.ObjectId(id)) : [],
    });
    return createdPractice.save();
  }

  async findAll(): Promise<Practice[]> {
    return this.practiceModel
      .find()
      .populate('course')
      .populate('student')
      .populate('teacher')
      .populate('protocols')
      .populate('submissions')
      .exec();
  }

  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceModel
      .findById(id)
      .populate('course')
      .populate('student')
      .populate('teacher')
      .populate('protocols')
      .populate('submissions')
      .exec();

    if (!practice) {
      throw new NotFoundException(`Practice #${id} not found`);
    }
    return practice;
  }

  async findMyPractices(userId: string): Promise<Practice[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let query: any = {};
    if (user.role === UserRole.STUDENT) {
      query = { student: new Types.ObjectId(userId) };
    } else if (user.role === UserRole.TEACHER_DIRECTIVE) {
      query = { teacher: new Types.ObjectId(userId) };
    } else {
      return [];
    }

    return this.practiceModel
      .find(query)
      .populate('course')
      .populate('student')
      .populate('teacher')
      .populate('protocols')
      .populate('submissions')
      .exec();
  }

  async findPracticesByTeacher(teacherId: string): Promise<Practice[]> {
    return this.practiceModel
      .find({ teacher: new Types.ObjectId(teacherId) })
      .populate('course')
      .populate('student')
      .populate('teacher')
      .populate('protocols')
      .populate('submissions')
      .exec();
  }

  async findPracticesByStudent(studentId: string): Promise<Practice[]> {
    return this.practiceModel
      .find({ student: new Types.ObjectId(studentId) })
      .populate('course')
      .populate('student')
      .populate('teacher')
      .populate('protocols')
      .populate('submissions')
      .exec();
  }

  async update(id: string, updatePracticeInput: UpdatePracticeInput): Promise<Practice> {
    const { protocolIds, ...updateData } = updatePracticeInput;
    const practice = await this.practiceModel.findById(id);

    if (!practice) {
      throw new NotFoundException(`Practice with ID ${id} not found`);
    }

    if (updateData.courseId) {
      practice.course = new Types.ObjectId(updateData.courseId);
    }
    if (updateData.studentId) {
      practice.student = new Types.ObjectId(updateData.studentId);
    }
    if (updateData.teacherId) {
      practice.teacher = new Types.ObjectId(updateData.teacherId);
    }
    if (updateData.status) {
      practice.status = updateData.status;
    }
    if (protocolIds) {
      practice.protocols = protocolIds.map(id => new Types.ObjectId(id));
    }

    return practice.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.practiceModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
