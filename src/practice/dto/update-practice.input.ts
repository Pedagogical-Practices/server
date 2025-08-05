import { Field, InputType, PartialType, ID } from '@nestjs/graphql';
import { CreatePracticeInput } from './create-practice.input';
import { IsOptional, IsString, IsArray } from 'class-validator';

@InputType()
export class UpdatePracticeInput extends PartialType(CreatePracticeInput) {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  protocols?: string[];
}
