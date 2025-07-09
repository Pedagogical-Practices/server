import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.dto';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRoles } from './roles.decorator';

@Resolver(() => UserDto)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    console.log('auth.resolver.ts: login, email:', email);
    return this.authService.login(email, password);
  }

  @Mutation(() => AuthPayload)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<AuthPayload> {
    console.log('auth.resolver.ts: createUser, input:', createUserInput);
    return this.authService.register(createUserInput);
  }

  @Mutation(() => UserDto)
  @UseGuards(AuthGuard)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: any,
  ): Promise<UserDto> {
    console.log('auth.resolver.ts: updateUser, user.sub:', user.sub);
    // Permite al usuario actualizar su propio perfil
    return this.authService.updateProfile(user.sub, updateUserInput);
  }

  @Mutation(() => UserDto)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async updateUserByAdmin(
    @Args('id') id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<UserDto> {
    return this.authService.updateUserById(id, updateUserInput);
  }

  @Query(() => UserDto, { nullable: true })
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: any): Promise<UserDto | null> {
    console.log('auth.resolver.ts: me query, user._id:', user._id);
    const userData = await this.authService.findOne(user._id);
    console.log('auth.resolver.ts: me query, userData:', userData);
    return userData;
  }

  @Query(() => [UserDto])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE)
  async users(): Promise<UserDto[]> {
    return this.authService.findAll();
  }

  @Query(() => UserDto, { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE)
  async user(@Args('id') id: string): Promise<UserDto | null> {
    return this.authService.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.authService.deleteUser(id);
  }

  @Query(() => Int)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async usersCount(): Promise<number> {
    return this.authService.countUsers();
  }
}