// form/dto/update-form.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { FormFieldDto } from './form-field.dto';

@InputType()
export class UpdateFormInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => [FormFieldDto], { nullable: true })
  fields: FormFieldDto[];
}
