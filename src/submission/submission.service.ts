import { Injectable, UnauthorizedException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { UserDto } from '../auth/dto/user.dto';
import { UserRoles } from '../auth/roles.decorator';
import { PracticeService } from '../practice/practice.service'; // Importar PracticeService

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @Inject(forwardRef(() => PracticeService)) private practiceService: PracticeService, // Inyectar PracticeService
  ) {}

  async create(
    createSubmissionInput: CreateSubmissionInput,
    userId: string,
  ): Promise<Submission> {
    const submission = new this.submissionModel({
      ...createSubmissionInput,
      submittedBy: userId,
    });
    return submission.save();
  }

  async update(
    updateSubmissionInput: UpdateSubmissionInput,
    userId: string,
  ): Promise<Submission | null> {
    const { id, ...updateData } = updateSubmissionInput;
    // Solo el usuario que lo creó o un admin/coordinator puede actualizarlo
    const existingSubmission = await this.submissionModel.findById(id).exec();
    if (!existingSubmission) {
      throw new NotFoundException(`Submission #${id} no encontrada`);
    }
    if (existingSubmission.submittedBy.toString() !== userId) {
      // Aquí se necesitaría una verificación de rol adicional para admin/coordinator
      // Por ahora, solo el creador puede actualizar
      throw new UnauthorizedException('No autorizado para actualizar esta submission');
    }

    return this.submissionModel
      .findByIdAndUpdate(
        id,
        { ...updateData, submittedBy: userId },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.submissionModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByProtocol(protocolId: string, user: UserDto): Promise<Submission[]> {
    let query: any = { protocolId };

    if (user.role === UserRoles.STUDENT) {
      // Un estudiante solo puede ver sus propias submissions
      query.submittedBy = user._id;
    } else if (user.role === UserRoles.TEACHER_DIRECTIVE) {
      // Un docente/directivo puede ver las submissions de sus estudiantes
      // Esto requiere obtener las prácticas donde es asesor y luego los estudiantes asociados
      const practices = await this.practiceService.findAll(user); // Reutilizar el método findAll de practiceservice
      const studentIds = practices.map(p => p.student.toString());
      query.submittedBy = { $in: studentIds };
    } else if (!(user.role === UserRoles.ADMIN || user.role === UserRoles.COORDINATOR)) {
      // Si no es admin, coordinador, estudiante o docente/directivo, no tiene acceso
      throw new UnauthorizedException('No autorizado para ver submissions');
    }

    return this.submissionModel.find(query).exec();
  }

  async findOne(id: string, user: UserDto): Promise<Submission | null> {
    const submission = await this.submissionModel.findById(id).exec();

    if (!submission) {
      throw new NotFoundException(`Submission #${id} no encontrada`);
    }

    // Verificar permisos basados en el rol
    if (user.role === UserRoles.STUDENT && submission.submittedBy.toString() !== user._id) {
      throw new UnauthorizedException('No autorizado para ver esta submission');
    } else if (user.role === UserRoles.TEACHER_DIRECTIVE) {
      // Un docente/directivo puede ver las submissions de sus estudiantes
      const practices = await this.practiceService.findAll(user); // Reutilizar el método findAll de practiceservice
      const studentIds = practices.map(p => p.student.toString());
      if (!studentIds.includes(submission.submittedBy.toString())) {
        throw new UnauthorizedException('No autorizado para ver esta submission');
      }
    } else if (!(user.role === UserRoles.ADMIN || user.role === UserRoles.COORDINATOR)) {
      // Si no es admin, coordinador, estudiante de la submission o docente/directivo de la submission
      throw new UnauthorizedException('No autorizado para ver esta submission');
    }

    return submission;
  }
}