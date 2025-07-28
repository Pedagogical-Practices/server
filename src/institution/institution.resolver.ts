import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { InstitutionService } from './institution.service';
import { Institution } from './entities/institution.entity';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(private readonly institutionService: InstitutionService) {}

  @Mutation(() => Institution)
  @Roles(UserRole.ADMIN)
  createInstitution(@Args('createInstitutionInput') createInstitutionInput: CreateInstitutionInput): Promise<Institution> {
    return this.institutionService.create(createInstitutionInput);
  }

  @Query(() => [Institution], { name: 'institutions' })
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  findAll(): Promise<Institution[]> {
    return this.institutionService.findAll();
  }

  @Query(() => Institution, { name: 'institution', nullable: true })
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Institution | null> {
    return this.institutionService.findOne(id);
  }

  @Mutation(() => Institution, { nullable: true })
  @Roles(UserRole.ADMIN)
  updateInstitution(@Args('updateInstitutionInput') updateInstitutionInput: UpdateInstitutionInput): Promise<Institution | null> {
    return this.institutionService.update(updateInstitutionInput.id, updateInstitutionInput);
  }

  @Mutation(() => Boolean)
  @Roles(UserRole.ADMIN)
  removeInstitution(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.institutionService.remove(id);
  }
}
