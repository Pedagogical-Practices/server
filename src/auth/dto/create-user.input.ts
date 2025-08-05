import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/enums/user-role.enum';
import { IsString, IsEmail, IsNotEmpty, IsArray } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Field(() => [UserRole])
  @IsArray()
  roles: UserRole[];
}
