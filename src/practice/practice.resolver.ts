import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PracticeService } from './practice.service';
import { Practice } from './schemas/practice.schema';
import { CreatePracticeInput } from './dto/create-practice.input';
import { UpdatePracticeInput } from './dto/update-practice.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Protocol } from '../protocol/schemas/protocol.schema';
import { ProtocolService } from '../protocol/protocol.service';

@Resolver(() => Practice)
@UseGuards(AuthGuard, RolesGuard)
export class PracticeResolver {
  constructor(
    private readonly practiceService: PracticeService,
    private readonly protocolService: ProtocolService,
  ) {}

  @Mutation(() => Practice)
  @Roles(UserRole.ADMIN)
  async createPractice(
    @Args('createPracticeInput') createPracticeInput: CreatePracticeInput,
  ): Promise<Practice> {
    return this.practiceService.create(createPracticeInput);
  }

  @Query(() => [Practice], { name: 'practices' })
  @Roles(
    UserRole.ADMIN,
    UserRole.COORDINATOR,
    UserRole.TUTOR,
    UserRole.STUDENT,
    UserRole.ASSESSOR,
    UserRole.FAMILY,
    UserRole.VISITOR,
  )
  async findAllPractices(): Promise<Practice[]> {
    return this.practiceService.findAll();
  }

  @Query(() => Practice, { name: 'practice' })
  @Roles(
    UserRole.ADMIN,
    UserRole.COORDINATOR,
    UserRole.TUTOR,
    UserRole.STUDENT,
    UserRole.ASSESSOR,
    UserRole.FAMILY,
    UserRole.VISITOR,
  )
  async findOnePractice(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Practice> {
    return this.practiceService.findOne(id);
  }

  @Mutation(() => Practice)
  @Roles(UserRole.ADMIN)
  async updatePractice(
    @Args('updatePracticeInput') updatePracticeInput: UpdatePracticeInput,
  ): Promise<Practice> {
    return this.practiceService.update(
      updatePracticeInput.id,
      updatePracticeInput,
    );
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.ADMIN)
  async removePractice(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.practiceService.remove(id);
  }

  @ResolveField(() => [Protocol])
  async protocols(@Parent() practice: Practice): Promise<Protocol[]> {
    if (practice.protocols && practice.protocols.length > 0) {
      const protocolIds = (practice.protocols as any[]).map((p) =>
        p._id.toHexString(),
      );
      return this.protocolService.findManyByIds(protocolIds);
    }
    return [];
  }
}
