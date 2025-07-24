import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';

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

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel.findById(id).exec();
    if (!form) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return form;
  }

  async update(id: string, updateFormInput: UpdateFormInput): Promise<Form> {
    const updatedForm = await this.formModel
      .findByIdAndUpdate(id, updateFormInput, { new: true })
      .exec();
    if (!updatedForm) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return updatedForm;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.formModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findManyByIds(ids: string[]): Promise<Form[]> {
    return this.formModel.find({ _id: { $in: ids } }).exec();
  }
}
