import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubmissionService } from './submission.service';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver(() => Submission)
@UseGuards(AuthGuard)
export class SubmissionResolver {
  constructor(private submissionService: SubmissionService) {}

  @Mutation(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE, UserRoles.STUDENT)
  async submitProtocol(
    @Args('createSubmissionInput') createSubmissionInput: CreateSubmissionInput,
    @CurrentUser() user: UserDto,
  ): Promise<Submission> {
    return this.submissionService.create(createSubmissionInput, user._id);
  }

  @Mutation(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async updateSubmission(
    @Args('updateSubmissionInput') updateSubmissionInput: UpdateSubmissionInput,
    @CurrentUser() user: UserDto,
  ): Promise<Submission | null> {
    return this.submissionService.update(updateSubmissionInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async deleteSubmission(@Args('id') id: string): Promise<boolean> {
    return this.submissionService.delete(id);
  }

  @Query(() => [Submission])
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE, UserRoles.STUDENT)
  async submissions(
    @Args('protocolId') protocolId: string,
    @CurrentUser() user: UserDto,
  ): Promise<Submission[]> {
    return this.submissionService.findByProtocol(protocolId, user);
  }

  @Query(() => Submission)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE, UserRoles.STUDENT)
  async submission(@Args('id') id: string, @CurrentUser() user: UserDto): Promise<Submission | null> {
    return this.submissionService.findOne(id, user);
  }
}