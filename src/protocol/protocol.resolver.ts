import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from '@nestjs/graphql';
import { ProtocolService } from './protocol.service';
import { Protocol } from './schemas/protocol.schema';
import { CreateProtocolInput, UpdateProtocolInput } from './dto/protocol.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { FormService } from '../form/form.service';
import { Form } from '../form/schemas/form.schema';

@Resolver(() => Protocol)
@UseGuards(AuthGuard)
export class ProtocolResolver {
  constructor(
    private protocolService: ProtocolService,
    private formService: FormService,
  ) {}

  @ResolveField('forms', () => [Form])
  async getForms(@Parent() protocol: Protocol): Promise<Form[]> {
    if (!protocol.forms || protocol.forms.length === 0) {
      return [];
    }
    const formIds = protocol.forms.map((form) => form.toString());
    return this.formService.findManyByIds(formIds);
  }


  @Mutation(() => Protocol)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createProtocol(
    @Args('input') createProtocolInput: CreateProtocolInput,
  ): Promise<Protocol> {
    return this.protocolService.create(createProtocolInput);
  }

  @Mutation(() => Protocol)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateProtocol(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateProtocolInput: UpdateProtocolInput,
  ): Promise<Protocol> {
    console.log(
      'SERVER DEBUG: updateProtocol - id:',
      id,
      'input:',
      updateProtocolInput,
    );
    return this.protocolService.update(id, updateProtocolInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteProtocol(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.protocolService.delete(id);
  }

  @Query(() => [Protocol])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  async protocols(): Promise<Protocol[]> {
    return this.protocolService.findAll();
  }

  @Query(() => Protocol)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  async protocol(@Args('id', { type: () => ID }) id: string): Promise<Protocol | null> {
    return this.protocolService.findOne(id);
  }
}
