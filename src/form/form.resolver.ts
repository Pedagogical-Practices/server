// src/form/form.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FormService } from './form.service';
import { FormDto } from './dto/form';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';

@Resolver(() => FormDto)
export class FormResolver {
  constructor(private readonly formService: FormService) {}

  @Mutation(() => FormDto)
  async createForm(@Args('createFormInput') createFormInput: CreateFormInput) {
    return this.formService.create(createFormInput);
  }

  @Query(() => [FormDto])
  async forms() {
    return this.formService.findAll();
  }

  @Query(() => FormDto)
  async form(@Args('id') id: string) {
    return this.formService.findOne(id);
  }

  @Mutation(() => FormDto)
  async updateForm(@Args('updateFormInput') updateFormInput: UpdateFormInput) {
    return this.formService.update(updateFormInput.id, updateFormInput);
  }

  @Mutation(() => FormDto)
  async removeForm(@Args('id') id: string) {
    return this.formService.remove(id);
  }
}
