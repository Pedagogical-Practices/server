import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProtocolResolver } from './protocol.resolver';
import { ProtocolService } from './protocol.service';
import { Protocol, ProtocolSchema } from './schemas/protocol.schema';
import { AuthModule } from 'src/auth/auth.module';
import { FormModule } from 'src/form/form.module'; // Importar FormModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Protocol.name, schema: ProtocolSchema },
    ]),
    AuthModule,
    FormModule, // Añadir FormModule
  ],
  providers: [ProtocolResolver, ProtocolService],
  exports: [MongooseModule.forFeature([{ name: Protocol.name, schema: ProtocolSchema }]), ProtocolService],
})
export class ProtocolModule {}
