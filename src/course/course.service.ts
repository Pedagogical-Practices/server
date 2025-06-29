// course.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(
    createCourseInput: CreateCourseInput,
    userId: string,
  ): Promise<Course> {
    console.log('Creating course by:', userId);
    const course = new this.courseModel({
      ...createCourseInput,
      createdBy: userId,
    });
    const savedCourse = await course.save();
    return savedCourse.populate('createdBy');
  }

  async update(
    updateCourseInput: UpdateCourseInput,
    userId: string,
  ): Promise<Course | null> {
    console.log('updateCourse: userId:', userId);
    const { id, ...updateData } = updateCourseInput;
    return this.courseModel
      .findByIdAndUpdate(
        id,
        { ...updateData, createdBy: userId },
        { new: true },
      )
      .populate('createdBy')
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('createdBy').exec();
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).populate('createdBy').exec();
  }
}
