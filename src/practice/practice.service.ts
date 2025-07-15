import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Practice, FilledForm } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { AuthService } from '../auth/auth.service'; // Para buscar estudiantes y asesores
import { ProtocolService } from '../protocol/protocol.service'; // Para buscar protocolos
import { FormService } from '../form/form.service'; // Para buscar formularios
import { SubmissionService } from '../submission/submission.service'; // Para manejar submissions
import { UserDto } from '../auth/dto/user.dto';
import { UserRoles } from '../auth/roles.decorator';

@Injectable()
export class PracticeService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    private authService: AuthService,
    private protocolService: ProtocolService,
    private formService: FormService,
    @Inject(forwardRef(() => SubmissionService))
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
    const initialFilledForms: FilledForm[] = protocol.forms.map(
      (formRef: any) => ({
        form: formRef._id, // Usar el _id del formulario populado
        submission: undefined, // Cambiado de null a undefined
      }),
    );

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
    const populatedPractice = await savedPractice.populate([
      { path: 'student' },
      { path: 'advisor' },
      { path: 'protocol', populate: { path: 'forms' } }, // Popula forms dentro de protocol
      { path: 'filledForms.form' }, // Popula el objeto Form dentro de filledForms
      { path: 'createdBy' }, // Asegurarse de popular createdBy también
    ]);
    return populatedPractice;
  }

  async findAll(): Promise<Practice[]> {
    return this.practiceModel
      .find()
      .populate('student')
      .populate('advisor')
      .populate({ path: 'protocol', populate: { path: 'forms' } })
      .populate('filledForms.form')
      .populate('createdBy')
      .exec();
  }

  async findForUser(user: UserDto): Promise<Practice[]> {
    let query: any = {};

    if (user.role === UserRoles.STUDENT) {
      query = { student: new Types.ObjectId(user._id) };
    } else if (user.role === UserRoles.TEACHER_DIRECTIVE) {
      query = { advisor: new Types.ObjectId(user._id) };
    } else if (user.role === UserRoles.FAMILY && user.studentId) {
      query = { student: new Types.ObjectId(user.studentId) };
    } else {
      return []; // Return empty for other roles or family without studentId
    }

    return this.practiceModel
      .find(query)
      .populate('student')
      .populate('advisor')
      .populate({ path: 'protocol', populate: { path: 'forms' } })
      .populate('filledForms.form')
      .populate('createdBy')
      .exec();
  }

  async findOne(id: string, user: UserDto): Promise<Practice> {
    const practice = await this.practiceModel
      .findById(id)
      .populate('student')
      .populate('advisor')
      .populate({ path: 'protocol', populate: { path: 'forms' } })
      .populate('filledForms.form')
      .populate('filledForms.submission')
      .populate('createdBy')
      .exec();

    console.log(
      'PracticeService: findOne - practice after population:',
      JSON.stringify(practice, null, 2),
    );

    if (!practice) {
      throw new NotFoundException(`Práctica #${id} no encontrada`);
    }

    // Permitir acceso si el usuario es ADMIN o COORDINATOR
    if (user.role === UserRoles.ADMIN || user.role === UserRoles.COORDINATOR) {
      return practice;
    }

    // Permitir acceso si el usuario es el estudiante de la práctica
    if (
      user.role === UserRoles.STUDENT &&
      practice.student._id.toString() === user._id
    ) {
      return practice;
    }

    // Permitir acceso si el usuario es el asesor de la práctica
    if (
      user.role === UserRoles.TEACHER_DIRECTIVE &&
      practice.advisor._id.toString() === user._id
    ) {
      return practice;
    }

    // Permitir acceso si el usuario es un familiar y está vinculado al estudiante de la práctica
    // (Asumiendo que user.studentId está populado y es el ID del estudiante)
    if (
      user.role === UserRoles.FAMILY &&
      user.studentId &&
      practice.student._id.toString() === user.studentId
    ) {
      return practice;
    }

    // Si ninguna de las condiciones anteriores se cumple, denegar el acceso
    throw new UnauthorizedException('No autorizado para ver esta práctica');
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
      throw new NotFoundException(
        `Práctica #${id} no encontrada después de actualizar`,
      );
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

    console.log(
      'PracticeService: registerFormSubmission - Before setting submission, filledForm:',
      JSON.stringify(filledForm, null, 2),
    );
    filledForm.submission = new Types.ObjectId(submissionId);
    console.log(
      'PracticeService: registerFormSubmission - After setting submission, filledForm:',
      JSON.stringify(filledForm, null, 2),
    );

    await practice.save();
    console.log(
      'PracticeService: registerFormSubmission - Practice after save:',
      JSON.stringify(practice, null, 2),
    );

    const populatedPractice = await practice.populate([
      { path: 'student' },
      { path: 'advisor' },
      { path: 'protocol', populate: { path: 'forms' } }, // Popula forms dentro de protocol
      { path: 'filledForms.form' }, // Popula el objeto Form dentro de filledForms
      { path: 'filledForms.submission' },
      { path: 'createdBy' }, // Asegurarse de popular createdBy también
    ]);
    console.log(
      'PracticeService: registerFormSubmission - Populated practice before return:',
      JSON.stringify(populatedPractice, null, 2),
    );
    return populatedPractice;
  }

  async countPractices(): Promise<number> {
    return this.practiceModel.countDocuments().exec();
  }
}
