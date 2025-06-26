// server/src/auth/auth.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.dto';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDto } from './dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';

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
    return this.authService.updateProfile(user.sub, updateUserInput);
  }

  @Query(() => UserDto, { nullable: true })
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: any): Promise<UserDto | null> {
    console.log('auth.resolver.ts: me query, user.sub:', user.sub);
    const userData = await this.authService.findOne(user.sub);
    console.log('auth.resolver.ts: me query, userData:', userData);
    return userData;
  }
}
