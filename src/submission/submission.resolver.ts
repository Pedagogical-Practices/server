// submission.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubmissionService } from './submission.service';
import { Submission } from './schemas/submission.schema';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Submission)
@UseGuards(AuthGuard)
export class SubmissionResolver {
  constructor(private submissionService: SubmissionService) {}

  @Mutation(() => Submission)
  async submitProtocol(
    @Args('createSubmissionInput') createSubmissionInput: CreateSubmissionInput,
    @CurrentUser() user: any,
  ): Promise<Submission> {
    return this.submissionService.create(createSubmissionInput, user.sub);
  }

  @Mutation(() => Submission)
  async updateSubmission(
    @Args('updateSubmissionInput') updateSubmissionInput: UpdateSubmissionInput,
    @CurrentUser() user: any,
  ): Promise<Submission | null> {
    return this.submissionService.update(updateSubmissionInput, user.sub);
  }

  @Mutation(() => Boolean)
  async deleteSubmission(@Args('id') id: string): Promise<boolean> {
    return this.submissionService.delete(id);
  }

  @Query(() => [Submission])
  async submissions(
    @Args('protocolId') protocolId: string,
  ): Promise<Submission[]> {
    return this.submissionService.findByProtocol(protocolId);
  }

  @Query(() => Submission)
  async submission(@Args('id') id: string): Promise<Submission | null> {
    return this.submissionService.findOne(id);
  }
}
