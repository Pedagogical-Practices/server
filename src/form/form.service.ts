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
    console.log('FormService: create - createFormInput.fields:', JSON.stringify(createFormInput.fields, null, 2));
    const createdForm = new this.formModel(createFormInput);
    return createdForm.save();
  }

  async createMany(createFormInputs: CreateFormInput[]): Promise<Form[]> {
    const createdForms = await this.formModel.insertMany(createFormInputs);
    return createdForms as unknown as Form[];
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.find().exec();
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel.findById(id).exec();
    if (!form) {
      throw new NotFoundException(`Form #${id} not found`);
    }

    const formObject = form.toObject({ getters: true, virtuals: true });
    if (formObject.fields && formObject.fields.length > 0) {
      formObject.fields = formObject.fields.map((field: any) => {
        // Ensure each field is a plain object and not a Mongoose subdocument instance
        return field.toObject ? field.toObject({ getters: true, virtuals: true }) : field;
      });
    }

    return formObject;
  }

  async update(id: string, updateFormInput: UpdateFormInput): Promise<Form> {
    console.log('FormService: update - updateFormInput.fields:', JSON.stringify(updateFormInput.fields, null, 2));
    const updatedForm = await this.formModel
      .findByIdAndUpdate(id, updateFormInput, { new: true })
      .exec();
    if (!updatedForm) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return updatedForm;
  }

  async createNewFormVersion(formId: string): Promise<Form> {
    const originalForm = await this.formModel.findById(formId).exec();
    if (!originalForm) {
      throw new NotFoundException(`Form with ID ${formId} not found`);
    }

    const newVersion = originalForm.version + 1;
    const newForm = new this.formModel({
      name: originalForm.name,
      description: originalForm.description,
      fields: originalForm.fields, // Deep copy if fields can be modified independently
      version: newVersion,
      parentForm: originalForm._id, // Link to the original form
    });

    return newForm.save();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.formModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findManyByIds(ids: string[]): Promise<Form[]> {
    return this.formModel.find({ _id: { $in: ids } }).exec();
  }
}
