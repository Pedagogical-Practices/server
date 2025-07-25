import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/enums/user-role.enum';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => UserRole)
  role: UserRole;
}
