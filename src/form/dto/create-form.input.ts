// form/dto/create-form.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { FormFieldDto } from './form-field.dto';

@InputType()
export class CreateFormInput {
  @Field()
  name: string;

  @Field(() => [FormFieldDto])
  fields: FormFieldDto[];
}
