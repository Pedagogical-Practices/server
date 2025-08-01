import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './schemas/course.schema';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ProtocolService } from '../protocol/protocol.service';
import { Protocol } from '../protocol/schemas/protocol.schema';

@Resolver(() => Course)
@UseGuards(AuthGuard)
export class CourseResolver {
  constructor(
    private courseService: CourseService,
    private protocolService: ProtocolService,
  ) {}

  @ResolveField('protocols', () => [Protocol])
  async getProtocols(@Parent() course: Course): Promise<Protocol[]> {
    if (!course.protocols || course.protocols.length === 0) {
      return [];
    }
    const protocolIds = course.protocols.map((p) => {
      // Check if it's already a populated object or just an ObjectId
      return (p instanceof Protocol ? p.id : p).toString();
    });
    return this.protocolService.findManyByIds(protocolIds);
  }

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
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateCourseInput: UpdateCourseInput,
  ): Promise<Course> {
    return this.courseService.update(id, updateCourseInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
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
  async course(@Args('id', { type: () => ID }) id: string): Promise<Course | null> {
    return this.courseService.findOne(id);
  }
}