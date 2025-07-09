import { Resolver, Query, Int } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, UserRoles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserDto } from '../auth/dto/user.dto';

@Resolver()
@UseGuards(AuthGuard, RolesGuard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => [ImportantDate])
  @Roles(UserRoles.ADMIN, UserRoles.COORDINATOR, UserRoles.TEACHER_DIRECTIVE, UserRoles.STUDENT)
  async importantDates(@CurrentUser() user: UserDto) {
    return this.dashboardService.getImportantDates(user);
  }
}

// Definir el tipo ImportantDate aquí o en un archivo separado
// Por ahora, lo definimos aquí para simplificar
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ImportantDate {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  date: string; // Formato ISO string

  @Field()
  entityType: string; // e.g., 'practice', 'submission', 'attendance'

  @Field(() => ID)
  relatedId: string; // ID de la entidad original

  @Field()
  semaphoreStatus: string; // 'verde', 'amarillo', 'rojo'
}
