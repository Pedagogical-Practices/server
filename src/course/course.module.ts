import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import { Course, CourseSchema } from './schemas/course.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ProtocolModule } from 'src/protocol/protocol.module'; // NEW IMPORT

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    AuthModule,
    ProtocolModule, // NEW ADDITION
  ],
  providers: [CourseResolver, CourseService],
  exports: [MongooseModule, CourseService],
})
export class CourseModule {}
