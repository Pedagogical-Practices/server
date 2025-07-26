import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateInstitutionInput } from './create-institution.input';

@InputType()
export class UpdateInstitutionInput extends PartialType(CreateInstitutionInput) {
  @Field(() => ID)
  id: string;
}
