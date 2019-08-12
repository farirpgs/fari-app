export enum FieldType {
  TextField,
  BigTextField,
  Category,
  Number,
  Boolean,
  Spacer
}

export interface IField {
  label?: string;
  slug?: string;
  type: FieldType;
  column: number;
  min?: number;
  max?: number;
  default?: string;
}
