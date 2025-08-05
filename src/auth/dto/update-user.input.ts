import { InputType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../../common/enums/user-role.enum';
import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  middleName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secondLastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field(() => [UserRole], { nullable: true })
  @IsOptional()
  @IsArray()
  roles?: UserRole[];
}
