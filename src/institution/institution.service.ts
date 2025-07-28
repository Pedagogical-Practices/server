import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution, InstitutionDocument } from './schemas/institution.schema';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectModel(Institution.name) private institutionModel: Model<InstitutionDocument>,
  ) {}

  async create(createInstitutionInput: CreateInstitutionInput): Promise<Institution> {
    const createdInstitution = new this.institutionModel(createInstitutionInput);
    const savedInstitution = await createdInstitution.save();
    return savedInstitution.toObject({ getters: true });
  }

  async findAll(): Promise<Institution[]> {
    const institutions = await this.institutionModel.find().exec();
    return institutions.map(inst => inst.toObject({ getters: true }));
  }

  async findOne(id: string): Promise<Institution | null> {
    const institution = await this.institutionModel.findById(id).exec();
    return institution ? institution.toObject({ getters: true }) : null;
  }

  async update(id: string, updateInstitutionInput: UpdateInstitutionInput): Promise<Institution | null> {
    const updatedInstitution = await this.institutionModel.findByIdAndUpdate(id, updateInstitutionInput, { new: true }).exec();
    return updatedInstitution ? updatedInstitution.toObject({ getters: true }) : null;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.institutionModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
