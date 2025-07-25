import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Resolver(() => Course)
@UseGuards(AuthGuard)
export class CourseResolver {
  constructor(private courseService: CourseService) {}

  @Mutation(() => Course)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCourse(
    @Args('input') createCourseInput: CreateCourseInput,
  ): Promise<Course> {
    return this.courseService.create(createCourseInput);
  }

  @Mutation(() => Course)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCourse(
    @Args('id') id: string,
    @Args('input') updateCourseInput: UpdateCourseInput,
  ): Promise<Course> {
    return this.courseService.update(id, updateCourseInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(@Args('id') id: string): Promise<boolean> {
    return this.courseService.delete(id);
  }

  @Query(() => [Course])
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  async courses(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Query(() => Course)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER_DIRECTIVE, UserRole.STUDENT)
  async course(@Args('id') id: string): Promise<Course | null> {
    return this.courseService.findOne(id);
  }
}