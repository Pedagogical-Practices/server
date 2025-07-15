import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { FormService } from './form.service';
import { FormDto } from './dto/form.dto';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver(() => FormDto)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async createForm(
    @Args('createFormInput') createFormInput: CreateFormInput,
    @CurrentUser() user: UserDto,
  ) {
    return this.formService.create(createFormInput, user._id);
  }

  @Query(() => [FormDto])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async forms() {
    return this.formService.findAll();
  }

  @Query(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.STUDENT)
  async form(@Args('id') id: string) {
    return this.formService.findOne(id);
  }

  @Mutation(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async updateForm(@Args('updateFormInput') updateFormInput: UpdateFormInput) {
    return this.formService.update(updateFormInput.id, updateFormInput);
  }

  @Mutation(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async removeForm(@Args('id') id: string) {
    return this.formService.remove(id);
  }

  @Query(() => Int)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async formsCount(): Promise<number> {
    return this.formService.countForms();
  }
}
