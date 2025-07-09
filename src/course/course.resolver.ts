import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';

@Resolver(() => Course)
@UseGuards(AuthGuard)
export class CourseResolver {
  constructor(private courseService: CourseService) {}

  @Mutation(() => Course)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @CurrentUser() user: any,
  ): Promise<Course> {
    return this.courseService.create(createCourseInput, user.sub);
  }

  @Mutation(() => Course)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
    @CurrentUser() user: any,
  ): Promise<Course | null> {
    console.log('createCourse: Current user:', user);
    return this.courseService.update(updateCourseInput, user.sub);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async deleteCourse(@Args('id') id: string): Promise<boolean> {
    return this.courseService.delete(id);
  }

  @Query(() => [Course])
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async courses(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Query(() => Course)
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR)
  async course(@Args('id') id: string): Promise<Course | null> {
    return this.courseService.findOne(id);
  }
}