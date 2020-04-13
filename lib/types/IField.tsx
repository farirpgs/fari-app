export enum FieldType {
  TextField,
  BigTextField,
  Category,
  Number,
  Boolean,
  Slider,
  Paper,
  AutoComplete,
}

export interface IField {
  label?: string;
  slug?: string;
  type: FieldType;

  min?: number;
  max?: number;
  default?: string | number;

  helper?: string;
  content?: string;
  marks?: Array<{ value: number; label: string }>;

  possibleValues?: Array<string>;
}
