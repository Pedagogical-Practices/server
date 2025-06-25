import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProtocolResolver } from './protocol.resolver';
import { ProtocolService } from './protocol.service';
import { Protocol, ProtocolSchema } from './schemas/protocol.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Protocol.name, schema: ProtocolSchema },
    ]),
    AuthModule,
  ],
  providers: [ProtocolResolver, ProtocolService],
})
export class ProtocolModule {}
