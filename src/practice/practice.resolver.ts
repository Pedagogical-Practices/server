import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from '@nestjs/graphql';
import { PracticeService } from './practice.service';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput, UpdatePracticeInput } from './dto/practice.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthService as UserService } from '../auth/auth.service'; // Assuming AuthService provides user-related methods
import { User } from '../auth/schemas/user.schema';
import { CourseService } from '../course/course.service';
import { Course } from '../course/schemas/course.schema';
import { ProtocolService } from '../protocol/protocol.service';
import { Protocol } from '../protocol/schemas/protocol.schema';
import { SubmissionService } from '../submission/submission.service';
import { Submission } from '../submission/schemas/submission.schema';


@Resolver(() => Practice)
@UseGuards(AuthGuard)
export class PracticeResolver {
  constructor(
    private readonly practiceService: PracticeService,
    private readonly userService: UserService, // Assuming AuthService is UserService
    private readonly courseService: CourseService,
    private readonly protocolService: ProtocolService,
    private readonly submissionService: SubmissionService,
  ) {}

  @ResolveField('student', () => User)
  async getStudent(@Parent() practice: Practice): Promise<User> {
    return this.userService.findOne(practice.student.toString());
  }

  @ResolveField('teacher', () => User)
  async getTeacher(@Parent() practice: Practice): Promise<User> {
    return this.userService.findOne(practice.teacher.toString());
  }

  @ResolveField('course', () => Course)
  async getCourse(@Parent() practice: Practice): Promise<Course> {
    return this.courseService.findOne(practice.course.toString());
  }

  @ResolveField('protocols', () => [Protocol])
  async getProtocols(@Parent() practice: Practice): Promise<Protocol[]> {
    if (!practice.protocols || practice.protocols.length === 0) {
      return [];
    }
    const protocolIds = practice.protocols.map((p) => (p instanceof Protocol ? p.id : p).toString());
    return this.protocolService.findManyByIds(protocolIds);
  }

  @ResolveField('submissions', () => [Submission])
  async getSubmissions(@Parent() practice: Practice): Promise<Submission[]> {
    if (!practice.submissions || practice.submissions.length === 0) {
      return [];
    }
    const submissionIds = practice.submissions.map((s) => (s instanceof Submission ? s.id : s).toString());
    return this.submissionService.findManyByIds(submissionIds);
  }


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