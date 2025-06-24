// update-protocol.input.ts
import { CreateProtocolInput } from './create-protocol.input';
import { PartialType } from '@nestjs/mapped-types';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProtocolInput extends PartialType(CreateProtocolInput) {
  @Field(() => ID)
  id: string;
}
