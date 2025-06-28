import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProtocolService } from './protocol.service';
import { Protocol } from './schemas/protocol.schema';
import { AttendanceRecord } from '../attendance/schemas/attendance.schema'; // Importar desde attendance
import {
  CreateProtocolInput,
  UpdateProtocolInput,
  CreateAttendanceRecordInput,
} from './dto/protocol.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Protocol)
@UseGuards(AuthGuard)
export class ProtocolResolver {
  constructor(private protocolService: ProtocolService) {}

  @Mutation(() => Protocol)
  async createProtocol(
    @Args('createProtocolInput') createProtocolInput: CreateProtocolInput,
    @CurrentUser() user: any,
  ): Promise<Protocol> {
    return this.protocolService.create(createProtocolInput, user.sub);
  }

  @Mutation(() => Protocol)
  async updateProtocol(
    @Args('updateProtocolInput') updateProtocolInput: UpdateProtocolInput,
    @CurrentUser() user: any,
  ): Promise<Protocol | null> {
    return this.protocolService.update(updateProtocolInput, user.sub);
  }

  @Mutation(() => Boolean)
  async deleteProtocol(@Args('id') id: string): Promise<boolean> {
    return this.protocolService.delete(id);
  }

  @Mutation(() => AttendanceRecord)
  async createAttendanceRecord(
    @Args('createAttendanceRecordInput')
    createAttendanceRecordInput: CreateAttendanceRecordInput,
    @CurrentUser() user: any,
  ): Promise<AttendanceRecord> {
    return this.protocolService.createAttendanceRecord(
      createAttendanceRecordInput,
      user.sub,
    );
  }

  @Query(() => [Protocol])
  async protocols(@Args('courseId') courseId: string): Promise<Protocol[]> {
    return this.protocolService.findByCourse(courseId);
  }

  @Query(() => Protocol)
  async protocol(@Args('id') id: string): Promise<Protocol | null> {
    return this.protocolService.findOne(id);
  }
}
