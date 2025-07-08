import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './schemas/form.schema';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { FormDto } from './dto/form.dto';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class FormService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async create(
    createFormInput: CreateFormInput,
    userId: string,
  ): Promise<FormDto> {
    console.log('FormService: create - createFormInput', createFormInput);
    const createdForm = new this.formModel({
      ...createFormInput,
      createdBy: userId,
    });
    const savedForm = await createdForm.save();
    console.log(
      'FormService: create - savedForm (Mongoose Document)',
      savedForm,
    );
    return this.mapToDto(savedForm);
  }

  async findAll(): Promise<FormDto[]> {
    const forms = await this.formModel.find().populate('createdBy').exec();
    console.log('FormService: findAll - forms (Mongoose Documents)', forms);
    return forms.map((form) => this.mapToDto(form));
  }

  async findOne(id: string): Promise<FormDto> {
    const form = await this.formModel.findById(id).populate('createdBy').exec();
    console.log('FormService: findOne - form (Mongoose Document)', form);
    if (!form) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return this.mapToDto(form);
  }

  async update(id: string, updateFormInput: UpdateFormInput): Promise<FormDto> {
    console.log('FormService: update - updateFormInput', updateFormInput);
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
    console.log(
      'FormService: update - updatedForm (Mongoose Document)',
      updatedForm,
    );
    if (!updatedForm) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return this.mapToDto(updatedForm);
  }

  async remove(id: string): Promise<FormDto> {
    const form = await this.formModel.findByIdAndDelete(id).exec();
    console.log('FormService: remove - deletedForm (Mongoose Document)', form);
    if (!form) {
      throw new NotFoundException(`Form #${id} not found`);
    }
    return this.mapToDto(form);
  }

  async countForms(): Promise<number> {
    return this.formModel.countDocuments().exec();
  }

  private mapToDto(form: Form): FormDto {
    const formDto = new FormDto();
    formDto._id = form._id.toHexString();
    formDto.name = form.name;
    formDto.createdAt = (form as any).createdAt;
    formDto.updatedAt = (form as any).updatedAt;

    formDto.fields = form.fields.map((field) => ({
      type: field.type,
      label: field.label,
      value: field.value,
      variableName: field.variableName,
      placeholder: field.placeholder,
      hint: field.hint,
      height: field.height,
      required: field.required,
      chapter: field.chapter,
      question: field.question,
      questionNumber: field.questionNumber,
      consistencyCondition: field.consistencyCondition,
      inconsistencyMessage: field.inconsistencyMessage,
      errorType: field.errorType,
      description: field.description,
      requirementLevel: field.requirementLevel,
      options: field.options,
      disabled: field.disabled,
      readonly: field.readonly,
      name: field.name,
      specificType: field.specificType,
      color: field.color,
      rules: field.rules,
      multiple: field.multiple,
      dataSource: (field as any).dataSource, // Aseguramos la inclusión de dataSource
    }));

    if (form.createdBy) {
      if (typeof form.createdBy === 'string') {
        // If createdBy is just an ID string, assign it directly
        formDto.createdBy = { _id: form.createdBy, name: '', email: '', role: '' }; // Provide default empty values
      } else {
        // If createdBy is a populated User object
        const createdBy = form.createdBy as any;
        formDto.createdBy = {
          _id: createdBy._id.toHexString(),
          name: createdBy.name,
          email: createdBy.email,
          role: createdBy.role,
        };
      }
    }

    console.log('FormService: mapToDto - final FormDto', formDto);
    return formDto;
  }
}
