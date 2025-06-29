export class CreateAttendanceDto {
  teacherId: string;
  week: string;
  date: string;
  topic: string;
  hours: number;
  group: string;
  classActivity: boolean;
  otherActivity: boolean;
  advisorSignature?: string;
  tutorSignature?: string;
}
