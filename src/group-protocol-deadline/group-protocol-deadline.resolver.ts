import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GroupProtocolDeadlineService } from './group-protocol-deadline.service';
import { GroupProtocolDeadline } from './schemas/group-protocol-deadline.schema';
import { CreateGroupProtocolDeadlineInput } from './dto/create-group-protocol-deadline.input';
import { UpdateGroupProtocolDeadlineInput } from './dto/update-group-protocol-deadline.input';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GroupService } from '../group/group.service';
import { ProtocolService } from '../protocol/protocol.service';
import { Group } from '../group/schemas/group.schema';
import { Protocol } from '../protocol/schemas/protocol.schema';

@Resolver(() => GroupProtocolDeadline)
@UseGuards(AuthGuard)
export class GroupProtocolDeadlineResolver {
  constructor(
    private readonly groupProtocolDeadlineService: GroupProtocolDeadlineService,
    private readonly groupService: GroupService,
    private readonly protocolService: ProtocolService,
  ) {}

  @ResolveField('group', () => Group)
  async getGroup(
    @Parent() groupProtocolDeadline: GroupProtocolDeadline,
  ): Promise<Group | null> {
    return this.groupService.findOne(groupProtocolDeadline.group.toString());
  }

  @ResolveField('protocol', () => Protocol)
  async getProtocol(
    @Parent() groupProtocolDeadline: GroupProtocolDeadline,
  ): Promise<Protocol> {
    const protocol = await this.protocolService.findOne(
      groupProtocolDeadline.protocol.toString(),
    );
    if (!protocol) {
      throw new NotFoundException(`Protocol with ID ${groupProtocolDeadline.protocol.toString()} not found`);
    }
    return protocol;
  }

  @Mutation(() => GroupProtocolDeadline)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR)
  async createGroupProtocolDeadline(
    @Args('input') input: CreateGroupProtocolDeadlineInput,
  ): Promise<GroupProtocolDeadline> {
    return this.groupProtocolDeadlineService.create(input);
  }

  @Mutation(() => GroupProtocolDeadline)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR)
  async updateGroupProtocolDeadline(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateGroupProtocolDeadlineInput,
  ): Promise<GroupProtocolDeadline> {
    return this.groupProtocolDeadlineService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR)
  async deleteGroupProtocolDeadline(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.groupProtocolDeadlineService.delete(id);
  }

  @Query(() => [GroupProtocolDeadline])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async groupProtocolDeadlines(): Promise<GroupProtocolDeadline[]> {
    return this.groupProtocolDeadlineService.findAll();
  }

  @Query(() => GroupProtocolDeadline)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async groupProtocolDeadline(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<GroupProtocolDeadline | null> {
    return this.groupProtocolDeadlineService.findOne(id);
  }
}
