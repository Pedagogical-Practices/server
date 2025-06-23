// ./src/form/dto/option.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OptionInput {
  @Field(() => String)
  label: string;

  @Field(() => String)
  value: string;
}
