import { InputType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../../common/enums/user-role.enum';

@InputType()
export class UpdateUserInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => UserRole, { nullable: true })
  role?: UserRole;
}
