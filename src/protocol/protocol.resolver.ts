import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProtocolService } from './protocol.service';
import { Protocol } from './schemas/protocol.schema';
import { AttendanceRecord } from '../attendance/schemas/attendance.schema';
import {
  CreateProtocolInput,
  UpdateProtocolInput,
  CreateAttendanceRecordInput,
} from './dto/protocol.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver(() => Protocol)
@UseGuards(AuthGuard)
export class ProtocolResolver {
  constructor(private protocolService: ProtocolService) {}

  @Mutation(() => Protocol)
  @Roles('admin') // Asumiendo que solo los admins pueden crear protocolos
  async createProtocol(
    @Args('createProtocolInput') createProtocolInput: CreateProtocolInput,
    @CurrentUser() user: UserDto,
  ): Promise<Protocol> {
    return this.protocolService.create(createProtocolInput, user._id);
  }

  @Mutation(() => Protocol)
  @Roles('admin') // Asumiendo que solo los admins pueden actualizar protocolos
  async updateProtocol(
    @Args('updateProtocolInput') updateProtocolInput: UpdateProtocolInput,
    @CurrentUser() user: UserDto,
  ): Promise<Protocol | null> {
    return this.protocolService.update(updateProtocolInput, user._id);
  }

  @Mutation(() => Boolean)
  @Roles('admin') // Asumiendo que solo los admins pueden eliminar protocolos
  async deleteProtocol(@Args('id') id: string): Promise<boolean> {
    return this.protocolService.delete(id);
  }

  @Mutation(() => AttendanceRecord)
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
}
