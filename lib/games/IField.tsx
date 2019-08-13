export enum FieldType {
  TextField,
  BigTextField,
  Category,
  Number,
  Boolean,

  Paper
}

export interface IField {
  label?: string;
  slug?: string;
  type: FieldType;

  offet?: number;
  column: number;

  min?: number;
  max?: number;
  default?: string;

  helper?: string;
  content?: string;
}
