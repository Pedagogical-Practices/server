import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FormService } from './form.service';
import { Form } from './schemas/form.schema';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Resolver(() => Form)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation(() => Form)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createForm(
    @Args('input') createFormInput: CreateFormInput,
  ): Promise<Form> {
    return this.formService.create(createFormInput);
  }

  @Query(() => [Form])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async forms(): Promise<Form[]> {
    return this.formService.findAll();
  }

  @Query(() => Form)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  async form(@Args('id') id: string): Promise<Form> {
    return this.formService.findOne(id);
  }

  @Mutation(() => Form)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateForm(
    @Args('id') id: string,
    @Args('input') updateFormInput: UpdateFormInput,
  ): Promise<Form> {
    return this.formService.update(id, updateFormInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteForm(@Args('id') id: string): Promise<boolean> {
    return this.formService.delete(id);
  }
}
