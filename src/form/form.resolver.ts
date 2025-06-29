import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FormService } from './form.service';
import { FormDto } from './dto/form.dto';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver(() => FormDto)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async createForm(
    @Args('createFormInput') createFormInput: CreateFormInput,
    @CurrentUser() user: UserDto,
  ) {
    return this.formService.create(createFormInput, user.sub);
  }

  @Query(() => [FormDto])
  @UseGuards(AuthGuard)
  async forms() {
    return this.formService.findAll();
  }

  @Query(() => FormDto)
  @UseGuards(AuthGuard)
  async form(@Args('id') id: string) {
    return this.formService.findOne(id);
  }

  @Mutation(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updateForm(@Args('updateFormInput') updateFormInput: UpdateFormInput) {
    return this.formService.update(updateFormInput.id, updateFormInput);
  }

  @Mutation(() => FormDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async removeForm(@Args('id') id: string) {
    return this.formService.remove(id);
  }
}
