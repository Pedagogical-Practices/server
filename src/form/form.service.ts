import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { Types } from 'mongoose';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async create(
    createFormInput: CreateFormInput,
    userId: string,
  ): Promise<Form> {
    const createdForm = new this.formModel({
      ...createFormInput,
      createdBy: new Types.ObjectId(userId),
    });
    return createdForm.save();
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.find().populate('createdBy', 'name email').exec();
  }

  async findOne(id: string): Promise<Form | null> {
    return this.formModel
      .findById(id)
      .populate('createdBy', 'name email')
      .exec();
  }

  async update(
    id: string,
    updateFormInput: UpdateFormInput,
  ): Promise<Form | null> {
    return this.formModel
      .findByIdAndUpdate(id, updateFormInput, { new: true })
      .populate('createdBy', 'name email')
      .exec();
  }

  async remove(id: string): Promise<Form | null> {
    return this.formModel.findByIdAndDelete(id).exec();
  }
}
