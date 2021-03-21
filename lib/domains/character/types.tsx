import { IDiceCommandGroupId } from "../dice/Dice";
import { CharacterTemplates } from "./CharacterType";

export enum BlockType {
  Text = "Text",
  Skill = "Skill",
  DicePool = "DicePool",
  PointCounter = "PointCounter",
  SlotTracker = "SlotTracker",
}

export enum Position {
  Left = "Left",
  Right = "Right",
}

/**
 * @deprecated Deprecated V1 Character
 */
export interface IV1Character {
  id: string;
  name: string;
  aspects: ICharacterV2CustomField<string>;
  skills: ICharacterV2CustomField<string>;
  stunts: ICharacterV2CustomField<string>;
  stressTracks: ICharacterV2CustomField<Array<boolean>>;
  consequences: ICharacterV2CustomField<string>;
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

/**
 * @deprecated Deprecated V2 Character
 */
export interface IV2Character {
  id: string;
  name: string;
  aspects: ICharacterV2CustomField<string>;
  skills: ICharacterV2CustomField<string>;
  stunts: ICharacterV2CustomField<string>;
  stressTracks: ICharacterV2CustomField<
    Array<{ checked?: boolean; label: string }>
  >;
  consequences: ICharacterV2CustomField<string>;
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

/**
 * @deprecated
 */
export type ICharacterV2CustomField<TValue> = Array<{
  name: string;
  value: TValue;
}>;

/**
 * V3
 */
export type ITextBlock = {
  type: BlockType.Text;
  meta: {
    checked?: boolean;
  };
  value: string;
};

export type ISkillBlock = {
  type: BlockType.Skill;
  meta: {
    checked?: boolean;
    commands?: Array<IDiceCommandGroupId>;
  };
  value: string;
};

export type IDicePoolBlock = {
  type: BlockType.DicePool;
  meta: {
    commands?: Array<IDiceCommandGroupId>;
  };
  value: string;
};

export type ISlotTrackerBlock = {
  type: BlockType.SlotTracker;
  meta: {};
  value: Array<{
    label: string;
    checked?: boolean;
  }>;
};

export type IPointCounterBlock = {
  type: BlockType.PointCounter;
  meta: {
    max?: string;
    isMainPointCounter: boolean;
  };
  value: string;
};

export type IBlockTypes =
  | ITextBlock
  | ISkillBlock
  | IDicePoolBlock
  | ISlotTrackerBlock
  | IPointCounterBlock;

export type IBlock = {
  type: BlockType;
  id: string;
  label: string;
} & IBlockTypes;

export type ISection = {
  id: string;
  label: string;
  position: Position;
  blocks: Array<IBlock>;
  visibleOnCard?: boolean;
};

export interface IPage {
  id: string;
  label: string;
  sections: Array<ISection>;
}

export interface ICharacter {
  id: string;
  name: string;
  group: string | undefined;

  pages: Array<IPage>;

  // hidden
  version: number;
  lastUpdated: number;
  template: CharacterTemplates;
  playedDuringTurn?: boolean;
}
