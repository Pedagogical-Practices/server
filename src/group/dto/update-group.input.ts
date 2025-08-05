import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateGroupInput } from './create-group.input';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @Field(() => ID, { nullable: true })
  id?: string;
}
