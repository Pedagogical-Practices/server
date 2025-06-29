import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async create(
    createFormInput: CreateFormInput,
    userId: string,
  ): Promise<Form> {
    const createdForm = new this.formModel({
      ...createFormInput,
      createdBy: userId,
    });
    const savedForm = await createdForm.save();
    return savedForm.populate('createdBy');
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.find().populate('createdBy').exec();
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel.findById(id).populate('createdBy').exec();
    if (!form) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return form;
  }

  async update(id: string, updateFormInput: UpdateFormInput): Promise<Form> {
    const { name, fields } = updateFormInput;
    const updatedForm = await this.formModel
      .findByIdAndUpdate(
        id,
        {
          name: name || undefined,
          fields: fields || undefined,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .populate('createdBy')
      .exec();
    if (!updatedForm) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return updatedForm;
  }

  async remove(id: string): Promise<Form> {
    const form = await this.formModel.findByIdAndDelete(id).exec();
    if (!form) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return form;
  }
}
