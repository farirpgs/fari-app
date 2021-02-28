export enum BlockType {
  Text = "Text",
  RichText = "RichText",
  Skill = "Skill",
  PointCounter = "PointCounter",
  SlotTracker = "SlotTracker",
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

export type ITextBlock = {
  type: BlockType.Text;
  value: string;
};
export type IRichTextBlock = {
  type: BlockType.RichText;
  value: string;
};

export type ISkillTextBlock = {
  type: BlockType.Skill;
  value: string;
};

export type ISlotTrackerBlock = {
  type: BlockType.SlotTracker;
  value: Array<{
    label: string;
    checked?: boolean;
  }>;
};

export type IPointCounterBlock = {
  type: BlockType.PointCounter;
  value: string;
};

export type IBlock = {
  type: BlockType;
  id: string;
  label: string;
} & (
  | ITextBlock
  | IRichTextBlock
  | ISkillTextBlock
  | ISlotTrackerBlock
  | IPointCounterBlock
);

export type ISection = {
  label: string;
  id: string;
  position: Position;
  blocks: Array<IBlock>;
  visibleOnCard?: boolean;
};

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
