import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution } from './schemas/institution.schema';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name) private institutionModel: Model<Institution>,
  ) {}

  async create(createInstitutionInput: CreateInstitutionInput): Promise<Institution> {
    const createdInstitution = new this.institutionModel(createInstitutionInput);
    return createdInstitution.save();
  }

  async findAll(search?: string): Promise<Institution[]> {
    if (search) {
      return this.institutionModel.find({ name: { $regex: search, $options: 'i' } }).exec();
    }
    return this.institutionModel.find().exec();
  }

  async findOne(id: string): Promise<Institution | null> {
    return this.institutionModel.findById(id).exec();
  }

  async update(updateInstitutionInput: UpdateInstitutionInput): Promise<Institution | null> {
    const { id, ...updateData } = updateInstitutionInput;
    return this.institutionModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.institutionModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}