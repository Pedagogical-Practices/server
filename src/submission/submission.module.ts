// submission.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionResolver } from './submission.resolver';
import { SubmissionService } from './submission.service';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { AuthModule } from 'src/auth/auth.module';
import { GraphQLJSON } from 'graphql-type-json';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    AuthModule,
  ],
  providers: [
    SubmissionResolver,
    SubmissionService,
    { provide: 'GraphQLJSON', useValue: GraphQLJSON },
  ],
})
export class SubmissionModule {}
