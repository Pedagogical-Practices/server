import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SubmissionService } from './submission.service';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { SubmissionStatus } from '../common/enums/submission-status.enum';

@Resolver(() => Submission)
@UseGuards(AuthGuard)
export class SubmissionResolver {
  constructor(private submissionService: SubmissionService) {}

  @Mutation(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  async createSubmission(
    @Args('input') createSubmissionInput: CreateSubmissionInput,
  ): Promise<Submission> {
    return this.submissionService.create(createSubmissionInput);
  }

  @Mutation(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async updateSubmission(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateSubmissionInput: UpdateSubmissionInput,
  ): Promise<Submission> {
    return this.submissionService.update(id, updateSubmissionInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  async deleteSubmission(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.submissionService.delete(id);
  }

  @Mutation(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRole.TUTOR, UserRole.ASSESSOR, UserRole.COORDINATOR)
  async evaluateSubmission(
    @Args('id', { type: () => ID }) id: string,
    @Args('score') score: number,
    @Args('feedback') feedback: string,
    @Args('status') status: SubmissionStatus,
  ): Promise<Submission> {
    return this.submissionService.evaluateSubmission(id, score, feedback, status);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async submissions(): Promise<Submission[]> {
    return this.submissionService.findAll();
  }

  @Query(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async submission(@Args('id', { type: () => ID }) id: string): Promise<Submission | null> {
    return this.submissionService.findOne(id);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async submissionsByGroup(
    @Args('groupId', { type: () => ID }) groupId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByGroup(groupId);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async submissionsByStudent(
    @Args('studentId', { type: () => ID }) studentId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByStudent(studentId);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.TUTOR, UserRole.STUDENT)
  async submissionsByStudentAndGroup(
    @Args('studentId', { type: () => ID }) studentId: string,
    @Args('groupId', { type: () => ID }) groupId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByStudentAndGroup(studentId, groupId);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async submissionsByFormAndGroup(
    @Args('groupId', { type: () => ID }) groupId: string,
    @Args('formId', { type: () => ID }) formId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByFormAndGroup(groupId, formId);
  }
}
