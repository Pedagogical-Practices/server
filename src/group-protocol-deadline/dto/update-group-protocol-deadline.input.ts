import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateGroupProtocolDeadlineInput } from './create-group-protocol-deadline.input';
import { IsDateString, IsOptional } from 'class-validator';

@InputType()
export class UpdateGroupProtocolDeadlineInput extends PartialType(CreateGroupProtocolDeadlineInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
