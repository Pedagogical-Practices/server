import { registerEnumType } from '@nestjs/graphql';

export enum FormFieldType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  DATE = 'DATE',
  MAP = 'MAP',
  FILE_UPLOAD = 'FILE_UPLOAD',
  CHECKBOX = 'CHECKBOX',
  DATE_PICKER = 'DATE_PICKER',
}

registerEnumType(FormFieldType, {
  name: 'FormFieldType',
});
