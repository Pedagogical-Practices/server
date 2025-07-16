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
      practiceId: createSubmissionInput.practiceId,
    });
    return submission.save();
  }

  async update(
    updateSubmissionInput: UpdateSubmissionInput,
    user: UserDto,
  ): Promise<Submission | null> {
    const { id, ...updateData } = updateSubmissionInput;
    const existingSubmission = await this.submissionModel.findById(id).exec();

    if (!existingSubmission) {
      throw new NotFoundException(`Submission #${id} no encontrada`);
    }

    const isOwner = existingSubmission.submittedBy.toString() === user._id;
    const isAdminOrCoordinator = [UserRoles.ADMIN, UserRoles.COORDINATOR].includes(user.role);

    if (!isOwner && !isAdminOrCoordinator) {
      throw new UnauthorizedException('No autorizado para actualizar esta submission');
    }

    return this.submissionModel
      .findByIdAndUpdate(
        id,
        { ...updateData },
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
      const practices = await this.practiceService.findForUser(user); // Reutilizar el método findForUser de practiceservice
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

    console.log("SubmissionService: findOne - user.role:", user.role);
    console.log("SubmissionService: findOne - user._id:", user._id);
    console.log("SubmissionService: findOne - submission.submittedBy:", submission.submittedBy.toString());

    // Permitir acceso si el usuario es ADMIN o COORDINATOR
    if (user.role === UserRoles.ADMIN || user.role === UserRoles.COORDINATOR) {
      return submission;
    }

    // Permitir acceso si el usuario es el que envió la submission
    if (user.role === UserRoles.STUDENT && submission.submittedBy.toString() === user._id) {
      return submission;
    }

    // Permitir acceso si el usuario es un docente/directivo y la submission pertenece a uno de sus estudiantes
    if (user.role === UserRoles.TEACHER_DIRECTIVE) {
      const practices = await this.practiceService.findForUser(user);
      const studentIds = practices.map(p => p.student.toString());
      if (studentIds.includes(submission.submittedBy.toString())) {
        return submission;
      }
    }

    // Si ninguna de las condiciones anteriores se cumple, denegar el acceso
    throw new UnauthorizedException('No autorizado para ver esta submission');
  }

  async findAll(user: UserDto): Promise<Submission[]> {
    let query: any = {};

    if (user.role === UserRoles.STUDENT) {
      query.submittedBy = user._id;
    } else if (user.role === UserRoles.TEACHER_DIRECTIVE) {
      const practices = await this.practiceService.findForUser(user);
      const studentIds = practices.map(p => p.student.toString());
      query.submittedBy = { $in: studentIds };
    } else if (!(user.role === UserRoles.ADMIN || user.role === UserRoles.COORDINATOR)) {
      throw new UnauthorizedException('No autorizado para ver submissions');
    }

    return this.submissionModel.find(query).exec();
  }
}