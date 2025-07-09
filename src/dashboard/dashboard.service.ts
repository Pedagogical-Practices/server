import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../auth/dto/user.dto';
import { UserRoles } from '../auth/roles.decorator';
import { PracticeService } from '../practice/practice.service';
import { ProtocolService } from '../protocol/protocol.service';
import { FormService } from '../form/form.service';
import { SubmissionService } from '../submission/submission.service';
import { AttendanceService } from '../attendance/attendance.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly practiceService: PracticeService,
    private readonly protocolService: ProtocolService,
    private readonly formService: FormService,
    private readonly submissionService: SubmissionService,
    private readonly attendanceService: AttendanceService,
  ) {}

  async getImportantDates(user: UserDto): Promise<any[]> {
    let importantDates: any[] = [];

    // Lógica para obtener fechas de Prácticas
    const practices = await this.practiceService.findAll(user);
    practices.forEach(practice => {
      if (practice.dueDate) {
        importantDates.push({
          id: practice._id.toString(),
          title: `Entrega Práctica: ${practice.courseName} - ${practice.institutionName}`,
          date: practice.dueDate,
          entityType: 'practice',
          relatedId: practice._id.toString(),
          semaphoreStatus: this.getSemaphoreStatus(practice.dueDate),
        });
      }
    });

    // Lógica para obtener fechas de Submissions (formularios llenados)
    // Esto es más complejo ya que necesitamos saber la fecha de vencimiento del formulario
    // Por ahora, usaremos la fecha de creación de la submission como ejemplo
    const submissions = await this.submissionService.findAll(user); // Asumiendo que findAll existe y filtra por usuario
    submissions.forEach(submission => {
      importantDates.push({
        id: submission._id.toString(),
        title: `Formulario Enviado: ${submission.formId}`,
        date: submission.createdAt, // Usar createdAt por ahora
        entityType: 'submission',
        relatedId: submission._id.toString(),
        semaphoreStatus: this.getSemaphoreStatus(submission.createdAt),
      });
    });

    // Lógica para obtener fechas de AttendanceRecords
    // Necesitamos una forma de obtener todos los attendance records para el usuario
    // Por ahora, esto es un placeholder
    // const attendanceRecords = await this.attendanceService.findAll(user);
    // attendanceRecords.forEach(record => {
    //   importantDates.push({
    //     id: record._id.toString(),
    //     title: `Registro de Asistencia: ${record.date}`,
    //     date: record.date,
    //     entityType: 'attendance',
    //     relatedId: record._id.toString(),
    //     semaphoreStatus: this.getSemaphoreStatus(record.date),
    //   });
    // });

    return importantDates;
  }

  private getSemaphoreStatus(dateString: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'rojo'; // Fecha pasada
    } else if (diffDays <= 7) {
      return 'amarillo'; // Próximos 7 días
    } else {
      return 'verde'; // Más de 7 días
    }
  }
}
