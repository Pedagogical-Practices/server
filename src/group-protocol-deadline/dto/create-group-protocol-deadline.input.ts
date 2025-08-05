import { InputType, Field, ID } from '@nestjs/graphql';
import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class CreateGroupProtocolDeadlineInput {
  @Field(() => ID)
  @IsMongoId()
  groupId: string;

  @Field(() => ID)
  @IsMongoId()
  protocolId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @Field()
  @IsDateString()
  endDate: Date;
}
