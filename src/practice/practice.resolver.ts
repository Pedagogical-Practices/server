import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PracticeService } from './practice.service';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Practice)
@UseGuards(AuthGuard)
export class PracticeResolver {
  constructor(private readonly practiceService: PracticeService) {}

  @Mutation(() => Practice)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPractice(
    @Args('input') createPracticeInput: CreatePracticeInput,
  ): Promise<Practice> {
    return this.practiceService.create(createPracticeInput);
  }

  @Mutation(() => Practice)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePractice(
    @Args('id') id: string,
    @Args('input') updatePracticeInput: UpdatePracticeInput,
  ): Promise<Practice> {
    return this.practiceService.update(id, updatePracticeInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deletePractice(@Args('id') id: string): Promise<boolean> {
    return this.practiceService.delete(id);
  }

  @Query(() => [Practice])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async practices(): Promise<Practice[]> {
    return this.practiceService.findAll();
  }

  @Query(() => [Practice])
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.TEACHER_DIRECTIVE)
  async myPractices(@CurrentUser() user: any): Promise<Practice[]> {
    return this.practiceService.findMyPractices(user.id);
  }

  @Query(() => Practice)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  async practice(@Args('id') id: string): Promise<Practice> {
    return this.practiceService.findOne(id);
  }

  @Query(() => [Practice])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE)
  async practicesByTeacher(@Args('teacherId') teacherId: string): Promise<Practice[]> {
    return this.practiceService.findPracticesByTeacher(teacherId);
  }

  @Query(() => [Practice])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE)
  async practicesByStudent(@Args('studentId') studentId: string): Promise<Practice[]> {
    return this.practiceService.findPracticesByStudent(studentId);
  }
}