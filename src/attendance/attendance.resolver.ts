import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from './schemas/attendance.schema';
import { CreateAttendanceRecordInput } from './dto/create-attendance-record.input';
import { GenerateAttendancePDFInput } from './dto/generate-attendance-pdf.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver(() => AttendanceRecord)
@UseGuards(AuthGuard)
export class AttendanceResolver {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Query(() => [AttendanceRecord], { name: 'attendanceRecords' })
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE)
  async findByProtocolId(
    @Args('protocolId', { type: () => String }) protocolId: string,
    @CurrentUser() user: UserDto,
  ): Promise<AttendanceRecord[]> {
    return this.attendanceService.findByProtocolId(protocolId, user);
  }

  @Mutation(() => AttendanceRecord)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE)
  async createAttendanceRecord(
    @Args('createAttendanceRecordInput') input: CreateAttendanceRecordInput,
    @CurrentUser() user: UserDto,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.createAttendanceRecord(input, user._id);
  }

  @Mutation(() => String)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE)
  async generateAttendancePDF(
    @Args('input', { type: () => GenerateAttendancePDFInput })
    input: GenerateAttendancePDFInput,
    @CurrentUser() user: UserDto,
  ): Promise<string> {
    const buffer = await this.attendanceService.generateAttendancePDF({
      ...input,
      submittedBy: user._id,
    });
    return buffer.toString('base64');
  }
}