import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { AuthModule } from '../auth/auth.module';
import { PracticeModule } from '../practice/practice.module';
import { ProtocolModule } from '../protocol/protocol.module';
import { FormModule } from '../form/form.module';
import { SubmissionModule } from '../submission/submission.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    AuthModule,
    PracticeModule,
    ProtocolModule,
    FormModule,
    SubmissionModule,
    AttendanceModule,
  ],
  providers: [DashboardService, DashboardResolver],
  exports: [DashboardService],
})
export class DashboardModule {}
