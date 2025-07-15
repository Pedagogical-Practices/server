import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PracticeService } from './practice.service';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { PracticeDto, FilledFormDto } from './dto/practice.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { PracticeStatus } from './schemas/practice.schema'; // Importar PracticeStatus

@Resolver(() => PracticeDto) // Usar PracticeDto como tipo de salida
export class PracticeResolver {
  constructor(private readonly practiceService: PracticeService) {}

  @Mutation(() => PracticeDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async createPractice(
    @Args('createPracticeInput') createPracticeInput: CreatePracticeInput,
    @CurrentUser() user: UserDto,
  ): Promise<Practice> {
    console.log('PracticeResolver: createPractice - user:', user);
    console.log('PracticeResolver: createPractice - user._id:', user._id);
    return this.practiceService.create(createPracticeInput, user._id);
  }

  @Mutation(() => PracticeDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async updatePractice(
    @Args('updatePracticeInput') updatePracticeInput: UpdatePracticeInput,
    @CurrentUser() user: UserDto,
  ): Promise<Practice> {
    return this.practiceService.update(updatePracticeInput, user._id);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async removePractice(@Args('id') id: string): Promise<boolean> {
    return this.practiceService.remove(id);
  }

  @Query(() => [PracticeDto])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async practices(): Promise<Practice[]> {
    return this.practiceService.findAll();
  }

  @Query(() => [PracticeDto])
  @UseGuards(AuthGuard) // Ensures the user is authenticated
  async myPractices(@CurrentUser() user: UserDto): Promise<Practice[]> {
    return this.practiceService.findForUser(user);
  }

  @Query(() => PracticeDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE, UserRoles.STUDENT)
  async practice(@Args('id') id: string, @CurrentUser() user: UserDto): Promise<Practice> {
    return this.practiceService.findOne(id, user);
  }

  // Mutación para registrar una submission en un formulario de una práctica
  @Mutation(() => PracticeDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE, UserRoles.STUDENT)
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

  @Query(() => Int)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async practicesCount(): Promise<number> {
    return this.practiceService.countPractices();
  }
}