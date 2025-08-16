// submission.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionResolver } from './submission.resolver';
import { SubmissionService } from './submission.service';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { AuthModule } from 'src/auth/auth.module';
import { GraphQLJSON } from 'graphql-type-json';
import { GroupModule } from 'src/group/group.module';
import { ProtocolModule } from '../protocol/protocol.module';
import { GroupProtocolDeadlineModule } from '../group-protocol-deadline/group-protocol-deadline.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    AuthModule,
    forwardRef(() => GroupModule),
    ProtocolModule,
    GroupProtocolDeadlineModule, // Importar el módulo de fechas límite
  ],
  providers: [
    SubmissionResolver,
    SubmissionService,
  ],
  exports: [SubmissionService],
})
export class SubmissionModule {}
