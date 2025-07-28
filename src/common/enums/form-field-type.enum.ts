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
  RADIO_GROUP = 'RADIO_GROUP',
  TIME_PICKER = 'TIME_PICKER',
  BUTTON = 'BUTTON',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  NUMBER = 'NUMBER',
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
}

registerEnumType(FormFieldType, {
  name: 'FormFieldType',
});
