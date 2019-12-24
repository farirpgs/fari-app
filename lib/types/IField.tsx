export enum FieldType {
  TextField,
  BigTextField,
  AutoComplete,
  Category,
  Number,
  Boolean,
  Slider,
  Paper
}

export interface IField {
  label?: string;
  slug?: string;
  type: FieldType;

  min?: number;
  max?: number;
  default?: string | number;

  helper?: string;
  possibleValues?: Array<string>;
  content?: string;
  marks?: Array<{ value: number; label: string }>;
}
