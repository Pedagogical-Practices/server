import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';

@InputType()
export class CreateProtocolInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  productType?: string;

  @Field(() => [ID])
  @IsArray()
  @IsMongoId({ each: true })
  formIds: string[];
}

@InputType()
export class UpdateProtocolInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  productType?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  formIds?: string[];
}