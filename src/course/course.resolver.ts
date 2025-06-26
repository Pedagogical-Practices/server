// course.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Course)
@UseGuards(AuthGuard)
export class CourseResolver {
  constructor(private courseService: CourseService) {}

  @Mutation(() => Course)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
    @CurrentUser() user: any,
  ): Promise<Course> {
    return this.courseService.create(createCourseInput, user.sub);
  }

  @Mutation(() => Course)
  async updateCourse(
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
    @CurrentUser() user: any,
  ): Promise<Course | null> {
    console.log('createCourse: Current user:', user);
    return this.courseService.update(updateCourseInput, user.sub);
  }

  @Mutation(() => Boolean)
  async deleteCourse(@Args('id') id: string): Promise<boolean> {
    return this.courseService.delete(id);
  }

  @Query(() => [Course])
  async courses(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Query(() => Course)
  async course(@Args('id') id: string): Promise<Course | null> {
    return this.courseService.findOne(id);
  }
}
