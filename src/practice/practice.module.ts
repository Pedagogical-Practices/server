import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Practice, PracticeSchema } from './schemas/practice.schema';
import { PracticeService } from './practice.service';
import { PracticeResolver } from './practice.resolver';
import { AuthModule } from '../auth/auth.module'; // Para inyectar UserService
import { ProtocolModule } from '../protocol/protocol.module'; // Para inyectar ProtocolService
import { FormModule } from '../form/form.module'; // Para inyectar FormService
import { SubmissionModule } from '../submission/submission.module'; // Para inyectar SubmissionService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }]),
    AuthModule, // Importar AuthModule para usar UserService
    ProtocolModule, // Importar ProtocolModule para usar ProtocolService
    FormModule, // Importar FormModule para usar FormService
    forwardRef(() => SubmissionModule), // Usar forwardRef para romper la dependencia circular
  ],
  providers: [PracticeService, PracticeResolver],
  exports: [PracticeService], // Exportar el servicio si otros módulos lo necesitan
})
export class PracticeModule {}