// ./src/form/dto/form-field.inputs.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { OptionInput } from './option.input';

@InputType()
export class FormFieldInput {
  @Field()
  type: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  variableName?: string;

  @Field({ nullable: true })
  placeholder?: string;

  @Field({ nullable: true })
  hint?: string;

  @Field({ nullable: true })
  height?: string;

  @Field({ nullable: true })
  required?: boolean;

  @Field({ nullable: true })
  chapter?: string;

  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  questionNumber?: string;

  @Field({ nullable: true })
  consistencyCondition?: string;

  @Field({ nullable: true })
  inconsistencyMessage?: string;

  @Field({ nullable: true })
  errorType?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  requirementLevel?: string;

  @Field(() => [OptionInput], { nullable: true })
  options?: OptionInput[];

  @Field({ nullable: true })
  disabled: boolean;

  @Field({ nullable: true })
  readonly: boolean;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  specificType: string;

  @Field({ nullable: true })
  color: string;

  @Field(() => [String], { nullable: true })
  rules: string[];
}
