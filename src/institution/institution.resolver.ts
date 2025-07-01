import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InstitutionService } from './institution.service';
import { CreateInstitutionInput } from './dto/create-institution.input';
import { UpdateInstitutionInput } from './dto/update-institution.input';
import { Institution } from './schemas/institution.schema';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';

@Resolver(() => Institution)
export class InstitutionResolver {
  constructor(private readonly institutionService: InstitutionService) {}

  @Mutation(() => Institution)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  createInstitution(
    @Args('createInstitutionInput')
    createInstitutionInput: CreateInstitutionInput,
  ): Promise<Institution> {
    return this.institutionService.create(createInstitutionInput);
  }

  @Query(() => [Institution])
  @UseGuards(AuthGuard)
  institutions(
    @Args('search', { nullable: true }) search?: string,
  ): Promise<Institution[]> {
    return this.institutionService.findAll(search);
  }

  @Query(() => Institution)
  @UseGuards(AuthGuard)
  institution(@Args('id') id: string): Promise<Institution | null> {
    return this.institutionService.findOne(id);
  }

  @Mutation(() => Institution)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  updateInstitution(
    @Args('updateInstitutionInput')
    updateInstitutionInput: UpdateInstitutionInput,
  ): Promise<Institution | null> {
    return this.institutionService.update(updateInstitutionInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  deleteInstitution(@Args('id') id: string): Promise<boolean> {
    return this.institutionService.remove(id);
  }
}
