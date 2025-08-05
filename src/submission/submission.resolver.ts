import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubmissionService } from './submission.service';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

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
    @Args('id') id: string,
    @Args('input') updateSubmissionInput: UpdateSubmissionInput,
  ): Promise<Submission> {
    return this.submissionService.update(id, updateSubmissionInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  async deleteSubmission(@Args('id') id: string): Promise<boolean> {
    return this.submissionService.delete(id);
  }

  @Mutation(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRole.TUTOR)
  async evaluateSubmission(
    @Args('id') id: string,
    @Args('score') score: number,
    @Args('feedback') feedback: string,
  ): Promise<Submission> {
    return this.submissionService.evaluateSubmission(id, score, feedback);
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
  async submission(@Args('id') id: string): Promise<Submission | null> {
    return this.submissionService.findOne(id);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR)
  async submissionsByGroup(
    @Args('groupId') groupId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByGroup(groupId);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async submissionsByStudent(
    @Args('studentId') studentId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByStudent(studentId);
  }
}
