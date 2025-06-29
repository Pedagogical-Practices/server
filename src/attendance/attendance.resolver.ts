import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from './schemas/attendance.schema';
import { CreateAttendanceRecordInput } from './dto/create-attendance-record.input';
import { GenerateAttendancePDFInput } from './dto/generate-attendance-pdf.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => AttendanceRecord)
@UseGuards(AuthGuard)
export class AttendanceResolver {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Query(() => [AttendanceRecord], { name: 'attendanceRecords' })
  async findByProtocolId(
    @Args('protocolId', { type: () => String }) protocolId: string,
  ): Promise<AttendanceRecord[]> {
    return this.attendanceService.findByProtocolId(protocolId);
  }

  @Mutation(() => AttendanceRecord)
  async createAttendanceRecord(
    @Args('createAttendanceRecordInput') input: CreateAttendanceRecordInput,
    @CurrentUser() user: any,
  ): Promise<AttendanceRecord> {
    return this.attendanceService.createAttendanceRecord(input, user.sub);
  }

  @Mutation(() => String)
  async generateAttendancePDF(
    @Args('input', { type: () => GenerateAttendancePDFInput })
    input: GenerateAttendancePDFInput,
    @CurrentUser() user: any,
  ): Promise<string> {
    const buffer = await this.attendanceService.generateAttendancePDF({
      ...input,
      submittedBy: user.sub,
    });
    return buffer.toString('base64');
  }
}
