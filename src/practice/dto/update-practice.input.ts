import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePracticeInput } from './create-practice.input';
import { IsOptional, IsString, IsArray } from 'class-validator';

@InputType()
export class UpdatePracticeInput extends PartialType(CreatePracticeInput) {
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
