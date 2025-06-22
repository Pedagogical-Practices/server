import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormService } from './form.service';
import { FormResolver } from './form.resolver';
import { Form, FormSchema } from './schemas/form.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Form.name, schema: FormSchema }]),
    AuthModule,
  ],
  providers: [FormResolver, FormService],
})
export class FormModule {}
