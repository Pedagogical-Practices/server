import { registerEnumType } from '@nestjs/graphql';

export enum FormFieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  DATE = 'DATE',
  MAP = 'MAP',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

registerEnumType(FormFieldType, {
  name: 'FormFieldType',
});
