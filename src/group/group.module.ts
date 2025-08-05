import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupResolver } from './group.resolver';
import { GroupService } from './group.service';
import { Group, GroupSchema } from './schemas/group.schema';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Practice, PracticeSchema } from '../practice/schemas/practice.schema';
import {
  Institution,
  InstitutionSchema,
} from '../institution/schemas/institution.schema';
import {
  GroupProtocolDeadline,
  GroupProtocolDeadlineSchema,
} from 'src/group-protocol-deadline/schemas/group-protocol-deadline.schema';
import { ProtocolModule } from 'src/protocol/protocol.module';
import { PracticeModule } from 'src/practice/practice.module';
import { InstitutionModule } from 'src/institution/institution.module';
import { GroupProtocolDeadlineModule } from 'src/group-protocol-deadline/group-protocol-deadline.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Practice', schema: PracticeSchema },
      { name: 'Institution', schema: InstitutionSchema },
      { name: 'GroupProtocolDeadline', schema: GroupProtocolDeadlineSchema },
    ]),
    AuthModule,
    ProtocolModule,
    PracticeModule,
    InstitutionModule,
    GroupProtocolDeadlineModule,
  ],
  providers: [GroupResolver, GroupService],
  exports: [MongooseModule, GroupService],
})
export class GroupModule {}
