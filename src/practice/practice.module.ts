import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Practice, PracticeSchema } from './schemas/practice.schema';
import { PracticeService } from './practice.service';
import { PracticeResolver } from './practice.resolver';
import { ProtocolModule } from '../protocol/protocol.module';
import { AuthModule } from '../auth/auth.module';
import { Protocol, ProtocolSchema } from '../protocol/schemas/protocol.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Practice.name, schema: PracticeSchema },
      { name: Protocol.name, schema: ProtocolSchema },
    ]),
    ProtocolModule,
    AuthModule,
  ],
  providers: [PracticeService, PracticeResolver],
  exports: [PracticeService, MongooseModule.forFeature([{ name: Practice.name, schema: PracticeSchema }])],
})
export class PracticeModule {}
