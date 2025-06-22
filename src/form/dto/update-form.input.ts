import { Field, InputType } from '@nestjs/graphql';
import { FormFieldInput } from './form-field.input';

@InputType()
export class UpdateFormInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => [FormFieldInput], { nullable: true })
  fields: FormFieldInput[];
}
