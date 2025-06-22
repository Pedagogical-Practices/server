import { ObjectType, Field } from '@nestjs/graphql';
import { FormFieldDto } from './form-field.dto';

@ObjectType()
export class FormDto {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [FormFieldDto])
  fields: FormFieldDto[];
}
