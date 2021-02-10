export enum SectionType {
  Text,
  Number,
  // BigNumber,
  Checkboxes,
}

export enum Position {
  Left,
  Right,
}

export interface IV1Character {
  id: string;
  name: string;
  aspects: ICharacterCustomField<string>;
  skills: ICharacterCustomField<string>;
  stunts: ICharacterCustomField<string>;
  stressTracks: ICharacterCustomField<Array<boolean>>;
  consequences: ICharacterCustomField<string>;
  aspectsLabel: string | undefined;
  skillsLabel: string | undefined;
  stuntsLabel: string | undefined;
  stressTracksLabel: string | undefined;
  consequencesLabel: string | undefined;
  refreshLabel: string | undefined;
  notesLabel: string | undefined;
  notes: string | undefined;
  group: string | undefined;
  refresh: number;
  // hidden
  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
  version: number;
  lastUpdated: number;
}

export interface IV2Character {
  id: string;
  name: string;
  aspects: ICharacterCustomField<string>;
  skills: ICharacterCustomField<string>;
  stunts: ICharacterCustomField<string>;
  stressTracks: ICharacterCustomField<
    Array<{ checked?: boolean; label: string }>
  >;
  consequences: ICharacterCustomField<string>;
  aspectsLabel: string | undefined;
  skillsLabel: string | undefined;
  stuntsLabel: string | undefined;
  stressTracksLabel: string | undefined;
  consequencesLabel: string | undefined;
  refreshLabel: string | undefined;
  notesLabel: string | undefined;
  notes: string | undefined;
  group: string | undefined;
  refresh: number;
  // hidden
  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
  version: number;
  lastUpdated: number;
}

export type ICharacterCustomField<TValue> = Array<{
  name: string;
  value: TValue;
}>;

export type IField<T = any> = {
  id: string;
  label: string;
  value: T;
};

export type ISection<T = any> = {
  label: string;
  id: string;
  position: Position;
  type: SectionType;
  fields: Array<IField<T>>;
  visibleOnCard?: boolean;
};

export type CheckboxesFieldValue = Array<{
  label: string;
  checked?: boolean;
}>;
export interface IPage {
  id: string;
  sections: Array<ISection>;
}

export interface ICharacter {
  id: string;
  name: string;
  group: string | undefined;
  refresh: number;

  pages: Array<IPage>;

  // hidden
  version: number;
  lastUpdated: number;

  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
}
