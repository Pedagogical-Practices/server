// ./src/form/dto/form.dto.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { FormFieldDto } from './form-field.dto';
import { UserDto } from '../../auth/dto/user.dto';

@ObjectType()
export class FormDto {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field(() => [FormFieldDto])
  fields: FormFieldDto[];

  @Field(() => UserDto)
  createdBy: UserDto;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
