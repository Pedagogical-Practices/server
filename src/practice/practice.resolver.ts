import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PracticeService } from './practice.service';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { PracticeDto, FilledFormDto } from './dto/practice.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { PracticeStatus } from './schemas/practice.schema'; // Importar PracticeStatus

@Resolver(() => PracticeDto) // Usar PracticeDto como tipo de salida
@UseGuards(AuthGuard)
export class PracticeResolver {
  constructor(private readonly practiceService: PracticeService) {}

  @Mutation(() => PracticeDto)
  @Roles('admin') // Solo administradores pueden crear prácticas
  async createPractice(
    @Args('createPracticeInput') createPracticeInput: CreatePracticeInput,
    @CurrentUser() user: UserDto,
  ): Promise<Practice> {
    console.log('PracticeResolver: createPractice - user:', user);
    console.log('PracticeResolver: createPractice - user._id:', user._id);
    return this.practiceService.create(createPracticeInput, user._id);
  }

  @Mutation(() => PracticeDto)
  @Roles('admin') // Solo administradores pueden actualizar prácticas
  async updatePractice(
    @Args('updatePracticeInput') updatePracticeInput: UpdatePracticeInput,
    @CurrentUser() user: UserDto,
  ): Promise<Practice> {
    return this.practiceService.update(updatePracticeInput, user._id);
  }

  @Mutation(() => Boolean)
  @Roles('admin') // Solo administradores pueden eliminar prácticas
  async removePractice(@Args('id') id: string): Promise<boolean> {
    return this.practiceService.remove(id);
  }

  @Query(() => [PracticeDto])
  async practices(): Promise<Practice[]> {
    return this.practiceService.findAll();
  }

  @Query(() => PracticeDto)
  async practice(@Args('id') id: string): Promise<Practice> {
    return this.practiceService.findOne(id);
  }

  // Mutación para registrar una submission en un formulario de una práctica
  @Mutation(() => PracticeDto)
  async registerFormSubmission(
    @Args('practiceId') practiceId: string,
    @Args('formId') formId: string,
    @Args('submissionId') submissionId: string,
    @CurrentUser() user: UserDto, // Opcional: para verificar permisos
  ): Promise<Practice> {
    // Aquí podrías añadir lógica de autorización:
    // - Solo el estudiante asignado a la práctica puede registrar submissions para sus formularios.
    // - Solo el asesor asignado a la práctica puede registrar submissions para sus estudiantes.
    // - Un admin puede hacerlo.
    return this.practiceService.registerFormSubmission(
      practiceId,
      formId,
      submissionId,
    );
  }
}