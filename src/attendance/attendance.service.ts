import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceRecord } from './schemas/attendance.schema';
import * as PDFKit from 'pdfkit';
import { CreateAttendanceRecordInput } from './dto/create-attendance-record.input';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(AttendanceRecord.name)
    private attendanceModel: Model<AttendanceRecord>,
  ) {}

  async findByProtocolId(protocolId: string): Promise<AttendanceRecord[]> {
    return this.attendanceModel.find({ protocolId }).exec();
  }

  async createAttendanceRecord(
    input: CreateAttendanceRecordInput,
    submittedBy: string,
  ): Promise<AttendanceRecord> {
    const record = new this.attendanceModel({
      ...input,
      submittedBy,
    });
    return record.save();
  }

  async generateAttendancePDF(data: {
    teacherName: string;
    advisorName: string;
    institution: string;
    tutorName: string;
    assignedGroups: string;
    records: CreateAttendanceRecordInput[];
    submittedBy: string;
  }): Promise<Buffer> {
    const doc = new PDFKit();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    // Encabezado
    doc
      .font('Times-Roman')
      .fontSize(14)
      .text('FORMATO DE CONTROL DE ASISTENCIA Y ACTIVIDADES CURRICULARES', {
        align: 'center',
      });
    doc
      .fontSize(12)
      .text(
        'Universidad de Córdoba - Facultad de Educación y Ciencias Humanas',
        { align: 'center' },
      );
    doc.text('Licenciatura en Informática y Medios Audiovisuales', {
      align: 'center',
    });
    doc.moveDown();

    // Campos de identificación
    doc.fontSize(10).text(`DOCENTE EN FORMACIÓN: ${data.teacherName}`);
    doc.text(`DOCENTE ASESOR: ${data.advisorName}`);
    doc.text(`INSTITUCIÓN EDUCATIVA: ${data.institution}`);
    doc.text(`DOCENTE TUTOR: ${data.tutorName}`);
    doc.text(`GRUPOS ASIGNADOS: ${data.assignedGroups}`);
    doc.text(`ENVIADO POR: ${data.submittedBy}`);
    doc.moveDown();

    // Tabla de asistencia
    doc.text('Tabla de Control de Asistencia y Actividades');
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [50, 70, 100, 50, 50, 50, 80, 80];
    const headers = [
      'SEMANA',
      'Fecha',
      'Tema / Actividad',
      'No. de horas',
      'Grupo',
      'Clase',
      'Otra',
      'Observaciones',
    ];

    // Dibujar encabezados de la tabla
    let x = tableLeft;
    headers.forEach((header, i) => {
      doc
        .rect(x, tableTop, colWidths[i], 20)
        .fillAndStroke('#f0f0f0', '#000000')
        .text(header, x + 5, tableTop + 5);
      x += colWidths[i];
    });

    // Dibujar filas de la tabla
    let y = tableTop + 20;
    data.records.forEach((record) => {
      x = tableLeft;
      doc
        .rect(x, y, colWidths[0], 20)
        .stroke()
        .text(record.week || '', x + 5, y + 5);
      x += colWidths[0];
      doc
        .rect(x, y, colWidths[1], 20)
        .stroke()
        .text(record.date || '', x + 5, y + 5);
      x += colWidths[1];
      doc
        .rect(x, y, colWidths[2], 20)
        .stroke()
        .text(record.topic || '', x + 5, y + 5);
      x += colWidths[2];
      doc
        .rect(x, y, colWidths[3], 20)
        .stroke()
        .text(record.hours?.toString() || '', x + 5, y + 5);
      x += colWidths[3];
      doc
        .rect(x, y, colWidths[4], 20)
        .stroke()
        .text(record.group || '', x + 5, y + 5);
      x += colWidths[4];
      doc
        .rect(x, y, colWidths[5], 20)
        .stroke()
        .text(record.classType || '', x + 5, y + 5);
      x += colWidths[5];
      doc
        .rect(x, y, colWidths[6], 20)
        .stroke()
        .text(record.other || '', x + 5, y + 5);
      x += colWidths[6];
      doc
        .rect(x, y, colWidths[7], 20)
        .stroke()
        .text(record.observations || '', x + 5, y + 5);
      y += 20;
    });

    // Notas
    doc.moveDown().fontSize(10).text('Notas:');
    doc.text(
      '• En caso de que el practicante no se presente, debe indicarse "no se presentó" en la columna "Tema" y debe ir la firma del docente asesor.',
    );
    doc.text(
      '• Si el número de filas semanales no coincide con la asistencia, el formato debe ajustarse, siendo este el único cambio permitido.',
    );

    // Observaciones
    doc.moveDown().text('OBSERVACIONES');
    doc.rect(50, doc.y, 500, 60).stroke();

    // Firmas
    doc
      .moveDown()
      .text(
        `Firma del Docente Asesor: ${data.records[0]?.advisorSignature || '____________________'}`,
        50,
        doc.y,
      );
    doc.text(
      `Firma del Docente Tutor: ${data.records[0]?.tutorSignature || '____________________'}`,
      300,
      doc.y,
    );

    doc.end();
    return new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}
