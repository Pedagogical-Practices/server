import { GroupService } from './group.service';
import { Group } from './schemas/group.schema';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { User } from '../auth/schemas/user.schema';
import { Institution } from '../institution/schemas/institution.schema';
import { Practice } from '../practice/schemas/practice.schema';
import { GroupProtocolDeadline } from '../group-protocol-deadline/schemas/group-protocol-deadline.schema';
import { ProtocolService } from '../protocol/protocol.service';
import { AuthService } from '../auth/auth.service';
import { InstitutionService } from '../institution/institution.service';
import { PracticeService } from '../practice/practice.service';
import { GroupProtocolDeadlineService } from '../group-protocol-deadline/group-protocol-deadline.service';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ID } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Group)
@UseGuards(AuthGuard)
export class GroupResolver {
  constructor(
    private groupService: GroupService,
    private protocolService: ProtocolService,
    private userService: AuthService,
    private practiceService: PracticeService,
    private institutionService: InstitutionService,
    private groupProtocolDeadlineService: GroupProtocolDeadlineService,
  ) {}

  @ResolveField('practice', () => Practice)
  async getPractice(@Parent() group: Group): Promise<Practice> {
    // If practice is already populated by Mongoose, return it directly
    if (group.practice && typeof group.practice === 'object' && 'name' in group.practice) {
      return group.practice;
    }
    // Otherwise, fetch it by ID (this case should ideally not happen if populate works)
    if (!group.practice) {
      throw new NotFoundException(`Practice reference for group ${group.id} is null or invalid`);
    }
    return this.practiceService.findOne(group.practice.toString());
  }

  @ResolveField('tutor', () => User)
  async getTutor(@Parent() group: Group): Promise<User> {
    if (group.tutor && typeof group.tutor === 'object' && 'firstName' in group.tutor) {
      return group.tutor;
    }
    if (!group.tutor) {
      throw new NotFoundException(`Tutor reference for group ${group.id} is null or invalid`);
    }
    const tutor = await this.userService.findOne(group.tutor.toString());
    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${group.tutor.toString()} not found`);
    }
    return tutor;
  }

  @ResolveField('students', () => [User])
  async getStudents(@Parent() group: Group): Promise<User[]> {
    // Check if students array is populated with objects
    if (group.students && group.students.length > 0 && typeof group.students[0] === 'object' && 'firstName' in group.students[0]) {
      return group.students as User[]; // Cast to User[] as it's already populated
    }
    // Otherwise, fetch them by ID
    return this.userService.findManyByIds(
      group.students.filter(s => s).map((s) => s.toString()), // Filter out any null/undefined references
    );
  }

  @ResolveField('institutions', () => [Institution])
  async getInstitutions(@Parent() group: Group): Promise<Institution[]> {
    // Check if institutions array is populated with objects
    if (group.institutions && group.institutions.length > 0 && typeof group.institutions[0] === 'object' && 'name' in group.institutions[0]) {
      return group.institutions as Institution[]; // Cast to Institution[]
    }
    // Otherwise, fetch them by ID
    return this.institutionService.findManyByIds(
      group.institutions.filter(i => i).map((i) => i.toString()), // Filter out any null/undefined references
    );
  }

  @ResolveField('deadlines', () => [GroupProtocolDeadline])
  async getDeadlines(@Parent() group: Group): Promise<GroupProtocolDeadline[]> {
    return this.groupProtocolDeadlineService.findManyByGroup(group.id);
  }

  @Mutation(() => Group)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  async createGroup(
    @Args('input') createGroupInput: CreateGroupInput,
  ): Promise<Group> {
    return this.groupService.create(createGroupInput);
  }

  @Mutation(() => Group)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  async updateGroup(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateGroupInput: UpdateGroupInput,
  ): Promise<Group> {
    return this.groupService.update(id, updateGroupInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR)
  async deleteGroup(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.groupService.delete(id);
  }

  @Query(() => [Group])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async groups(): Promise<Group[]> {
    return this.groupService.findAll();
  }

  @Query(() => Group)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async group(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Group | null> {
    return this.groupService.findOne(id);
  }

  @Query(() => [Group])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR)
  async groupsByTutor(
    @Args('tutorId', { type: () => ID }) tutorId: string,
  ): Promise<Group[]> {
    return this.groupService.findGroupsByTutor(tutorId);
  }

  @Query(() => [Group])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async groupsByStudent(
    @Args('studentId', { type: () => ID }) studentId: string,
  ): Promise<Group[]> {
    return this.groupService.findGroupsByStudent(studentId);
  }

  @Query(() => [Group])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT) // Only students should see their own groups
  async myGroups(@CurrentUser() user: any): Promise<Group[]> {
    // Assuming user.id is the ID of the currently logged-in user
    return this.groupService.findGroupsByStudent(user.id);
  }
}
