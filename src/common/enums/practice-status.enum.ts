import { registerEnumType } from '@nestjs/graphql';

export enum PracticeStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(PracticeStatus, {
  name: 'PracticeStatus',
});
