import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstitutionService } from './institution.service';
import { InstitutionResolver } from './institution.resolver';
import { Institution, InstitutionSchema } from './schemas/institution.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institution.name, schema: InstitutionSchema },
    ]),
  ],
  providers: [InstitutionResolver, InstitutionService],
  exports: [InstitutionService],
})
export class InstitutionModule {}
