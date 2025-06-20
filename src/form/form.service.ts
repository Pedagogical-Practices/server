// src/form/form.service.ts
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async create(createFormInput: CreateFormInput): Promise<Form> {
    const createdForm = new this.formModel(createFormInput);
    return createdForm.save();
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.find().exec();
  }

  async findOne(id: string): Promise<Form | null> {
    return this.formModel.findById(id).exec();
  }

  async update(
    id: string,
    updateFormInput: UpdateFormInput,
  ): Promise<Form | null> {
    return this.formModel
      .findByIdAndUpdate(id, updateFormInput, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Form | null> {
    return this.formModel.findByIdAndDelete(id).exec();
  }
}
