import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OptionDto {
  @Field(() => String)
  label: string;

  @Field(() => String)
  value: string;
}
