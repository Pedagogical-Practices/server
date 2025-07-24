import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    const { protocolIds, ...courseData } = createCourseInput;
    const createdCourse = new this.courseModel({
      ...courseData,
      startDate: new Date(courseData.startDate),
      endDate: new Date(courseData.endDate),
      protocols: protocolIds ? protocolIds.map(id => new Types.ObjectId(id)) : [],
    });
    return createdCourse.save();
  }

  async update(id: string, updateCourseInput: UpdateCourseInput): Promise<Course> {
    const { protocolIds, ...updateData } = updateCourseInput;
    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    if (updateData.startDate) {
      course.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      course.endDate = new Date(updateData.endDate);
    }
    if (updateData.name) {
      course.name = updateData.name;
    }
    if (updateData.description) {
      course.description = updateData.description;
    }
    if (protocolIds) {
      course.protocols = protocolIds.map(id => new Types.ObjectId(id));
    }

    return course.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.courseModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('protocols').exec();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).populate('protocols').exec();
  }
}
