import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupProtocolDeadline, GroupProtocolDeadlineSchema } from './schemas/group-protocol-deadline.schema';
import { GroupProtocolDeadlineService } from './group-protocol-deadline.service';
import { GroupProtocolDeadlineResolver } from './group-protocol-deadline.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { GroupModule } from 'src/group/group.module';
import { ProtocolModule } from 'src/protocol/protocol.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroupProtocolDeadline.name, schema: GroupProtocolDeadlineSchema }]),
    AuthModule,
    forwardRef(() => GroupModule),
    ProtocolModule,
  ],
  providers: [GroupProtocolDeadlineResolver, GroupProtocolDeadlineService],
  exports: [GroupProtocolDeadlineService],
})
export class GroupProtocolDeadlineModule {}
