import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.dto';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { User } from './schemas/user.schema';
import { UserRole } from '../common/enums/user-role.enum';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    return this.authService.login(email, password);
  }

  @Mutation(() => User)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.authService.createUser(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.authService.updateUser(id, updateUserInput);
  }

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: any): Promise<User | null> {
    return this.authService.findOne(user.id);
  }

  @Query(() => [User])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.STUDENT, UserRole.TEACHER_DIRECTIVE)
  async users(): Promise<User[]> {
    return this.authService.findAll();
  }

  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.STUDENT)
  async user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.authService.findOne(id);
  }

  @Query(() => [User])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TUTOR, UserRole.ASSESSOR, UserRole.STUDENT)
  async usersByIds(@Args('ids', { type: () => [ID] }) ids: string[]): Promise<User[]> {
    return this.authService.findManyByIds(ids);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.authService.deleteUser(id);
  }
}