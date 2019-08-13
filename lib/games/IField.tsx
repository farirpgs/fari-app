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

  min?: number;
  max?: number;
  default?: string;

  helper?: string;
  content?: string;
}
