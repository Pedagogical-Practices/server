import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Institution, InstitutionSchema } from './schemas/institution.schema';
import { InstitutionService } from './institution.service';
import { InstitutionResolver } from './institution.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Institution.name, schema: InstitutionSchema }]),
    AuthModule,
  ],
  providers: [InstitutionResolver, InstitutionService],
})
export class InstitutionModule {}

