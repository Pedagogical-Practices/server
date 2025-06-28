import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from './attendance.service';
import { AttendanceResolver } from './attendance.resolver';
import {
  AttendanceRecord,
  AttendanceRecordSchema,
} from './schemas/attendance.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttendanceRecord.name, schema: AttendanceRecordSchema },
    ]),
    AuthModule,
  ],
  providers: [AttendanceService, AttendanceResolver],
})
export class AttendanceModule {}
