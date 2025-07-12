import { Resolver, Query, Mutation, Args, Context, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProtocolService } from './protocol.service';
import { Protocol } from './schemas/protocol.schema';
import { Form } from '../form/schemas/form.schema'; // Importar Form
import { FormService } from '../form/form.service'; // Importar FormService
import { AttendanceRecord } from '../attendance/schemas/attendance.schema';
import {
  CreateProtocolInput,
  UpdateProtocolInput,
  CreateAttendanceRecordInput,
} from './dto/protocol.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver(() => Protocol)
@UseGuards(AuthGuard)
export class ProtocolResolver {
  constructor(
    private protocolService: ProtocolService,
    private formService: FormService, // Inyectar FormService
  ) {}

  @Mutation(() => Protocol)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async createProtocol(
    @Args('createProtocolInput') createProtocolInput: CreateProtocolInput,
    @CurrentUser() user: UserDto,
  ): Promise<Protocol> {
    return this.protocolService.create(createProtocolInput, user._id);
  }

  @Mutation(() => Protocol)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async updateProtocol(
    @Args('updateProtocolInput') updateProtocolInput: UpdateProtocolInput,
    @CurrentUser() user: UserDto,
  ): Promise<Protocol | null> {
    return this.protocolService.update(updateProtocolInput, user._id);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  async deleteProtocol(@Args('id') id: string): Promise<boolean> {
    return this.protocolService.delete(id);
  }

  @Mutation(() => AttendanceRecord)
  // No se especificaron roles para esta mutación, se mantiene el comportamiento actual
  async createAttendanceRecord(
    @Args('createAttendanceRecordInput')
    createAttendanceRecordInput: CreateAttendanceRecordInput,
    @CurrentUser() user: UserDto,
  ): Promise<AttendanceRecord> {
    return this.protocolService.createAttendanceRecord(
      createAttendanceRecordInput,
      user._id,
    );
  }

  @Query(() => [Protocol])
  async protocols(): Promise<Protocol[]> {
    // Ya no filtra por courseId
    return this.protocolService.findAll();
  }

  @Query(() => Protocol)
  async protocol(@Args('id') id: string): Promise<Protocol | null> {
    return this.protocolService.findOne(id);
  }

  @Query(() => Int)
  async protocolsCount(): Promise<number> {
    return this.protocolService.countProtocols();
  }

  @ResolveField('forms', () => [Form])
  async getForms(@Parent() protocol: Protocol): Promise<Form[]> {
    if (!protocol.forms || protocol.forms.length === 0) {
      return [];
    }
    // Asumimos que protocol.forms es una lista de IDs
    const formIds = protocol.forms.map(form => (form as any)._id || form);
    return this.formService.findManyByIds(formIds);
  }
}
