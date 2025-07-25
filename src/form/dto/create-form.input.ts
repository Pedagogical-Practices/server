import { Field, InputType } from '@nestjs/graphql';
import { FormFieldInput } from './form-field.input';

@InputType()
export class CreateFormInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [FormFieldInput])
  fields: FormFieldInput[];
}
