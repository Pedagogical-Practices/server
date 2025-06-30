import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Practice, FilledForm } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { AuthService } from '../auth/auth.service'; // Para buscar estudiantes y asesores
import { ProtocolService } from '../protocol/protocol.service'; // Para buscar protocolos
import { FormService } from '../form/form.service'; // Para buscar formularios
import { SubmissionService } from '../submission/submission.service'; // Para manejar submissions

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    private authService: AuthService,
    private protocolService: ProtocolService,
    private formService: FormService,
    private submissionService: SubmissionService,
  ) {}

  async create(
    createPracticeInput: CreatePracticeInput,
    createdByUserId: string,
  ): Promise<Practice> {
    console.log('PracticeService: create - createdByUserId:', createdByUserId);
    const { studentId, advisorId, protocolId, institutionName, courseName } =
      createPracticeInput;

    // Verificar que el estudiante, asesor y protocolo existan
    const student = await this.authService.findOne(studentId);
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    const advisor = await this.authService.findOne(advisorId);
    if (!advisor) throw new NotFoundException('Asesor no encontrado');

    const protocol = await this.protocolService.findOne(protocolId);
    if (!protocol) throw new NotFoundException('Protocolo no encontrado');

    // Inicializar filledForms con los formularios del protocolo
    const initialFilledForms: FilledForm[] = protocol.forms.map((formRef: any) => ({
      form: formRef._id, // Usar el _id del formulario populado
      submission: undefined, // Cambiado de null a undefined
    }));

    const createdPractice = new this.practiceModel({
      student: new Types.ObjectId(studentId),
      advisor: new Types.ObjectId(advisorId),
      protocol: new Types.ObjectId(protocolId),
      institutionName,
      courseName,
      createdBy: new Types.ObjectId(createdByUserId),
      filledForms: initialFilledForms,
    });

    const savedPractice = await createdPractice.save();
    const populatedPractice = await savedPractice
      .populate([
        { path: 'student' },
        { path: 'advisor' },
        { path: 'protocol', populate: { path: 'forms' } }, // Popula forms dentro de protocol
        { path: 'filledForms.form' }, // Popula el objeto Form dentro de filledForms
        { path: 'createdBy' } // Asegurarse de popular createdBy también
      ]);
    return populatedPractice;
  }

  async findAll(): Promise<Practice[]> {
    return this.practiceModel
      .find()
      .populate('student')
      .populate('advisor')
      .populate({ path: 'protocol', populate: { path: 'forms' } }) // Popula forms dentro de protocol
      .populate('filledForms.form') // Popula el objeto Form dentro de filledForms
      .populate('createdBy') // Asegurarse de popular createdBy también
      .exec();
  }

  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceModel
      .findById(id)
      .populate('student')
      .populate('advisor')
      .populate({ path: 'protocol', populate: { path: 'forms' } }) // Popula forms dentro de protocol
      .populate('filledForms.form') // Popula el objeto Form dentro de filledForms
      .populate('createdBy') // Asegurarse de popular createdBy también
      .exec();
    if (!practice) {
      throw new NotFoundException(`Práctica #${id} no encontrada`);
    }
    return practice;
  }

  async update(
    updatePracticeInput: UpdatePracticeInput,
    userId: string, // Usuario que realiza la actualización
  ): Promise<Practice> {
    const { id, studentId, advisorId, protocolId, ...updateData } =
      updatePracticeInput;

    const practice = await this.practiceModel.findById(id).exec();
    if (!practice) {
      throw new NotFoundException(`Práctica #${id} no encontrada`);
    }

    // Opcional: Verificar permisos (ej. solo el creador o un admin puede actualizar)
    // if (practice.createdBy.toString() !== userId && !user.isAdmin) {
    //   throw new UnauthorizedException('No autorizado para actualizar esta práctica');
    // }

    // Actualizar referencias si se proporcionan nuevos IDs
    if (studentId) {
      const student = await this.authService.findOne(studentId);
      if (!student) throw new NotFoundException('Estudiante no encontrado');
      (updateData as any).student = studentId;
    }
    if (advisorId) {
      const advisor = await this.authService.findOne(advisorId);
      if (!advisor) throw new NotFoundException('Asesor no encontrado');
      (updateData as any).advisor = advisorId;
    }
    if (protocolId) {
      const protocol = await this.protocolService.findOne(protocolId);
      if (!protocol) throw new NotFoundException('Protocolo no encontrado');
      (updateData as any).protocol = protocolId;
    }

    const updatedPractice = await this.practiceModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('student')
      .populate('advisor')
      .populate({ path: 'protocol', populate: { path: 'forms' } }) // Popula forms dentro de protocol
      .populate('filledForms.form') // Popula el objeto Form dentro de filledForms
      .populate('createdBy') // Asegurarse de popular createdBy también
      .exec();

    if (!updatedPractice) {
      throw new NotFoundException(`Práctica #${id} no encontrada después de actualizar`);
    }
    return updatedPractice;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.practiceModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Método para registrar una submission en un formulario de una práctica
  async registerFormSubmission(
    practiceId: string,
    formId: string,
    submissionId: string,
  ): Promise<Practice> {
    const practice = await this.practiceModel.findById(practiceId).exec();
    if (!practice) {
      throw new NotFoundException(`Práctica #${practiceId} no encontrada`);
    }

    const filledForm = practice.filledForms.find(
      (ff) => ff.form.toString() === formId,
    );

    if (!filledForm) {
      throw new NotFoundException(
        `Formulario #${formId} no encontrado en la práctica #${practiceId}`,
      );
    }

    if (filledForm.submission) {
      throw new Error(
        `El formulario #${formId} en la práctica #${practiceId} ya tiene una submission registrada.`,
      );
    }

    filledForm.submission = new Types.ObjectId(submissionId);
    await practice.save();

    const populatedPractice = await practice
      .populate([
        { path: 'student' },
        { path: 'advisor' },
        { path: 'protocol', populate: { path: 'forms' } }, // Popula forms dentro de protocol
        { path: 'filledForms.form' }, // Popula el objeto Form dentro de filledForms
        { path: 'filledForms.submission' },
        { path: 'createdBy' } // Asegurarse de popular createdBy también
      ]);
    return populatedPractice;
    return populatedPractice;
  }
}