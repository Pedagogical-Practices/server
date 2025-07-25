import { InputType, Field } from '@nestjs/graphql';
import { FormFieldType } from '../../common/enums/form-field-type.enum';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class FormFieldInput {
  @Field()
  name: string;

  @Field()
  label: string;

  @Field(() => FormFieldType)
  type: FormFieldType;

  @Field(() => GraphQLJSON, { nullable: true })
  options?: any;

  @Field(() => [String], { nullable: true })
  rules?: string[];
}
