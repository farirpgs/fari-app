import { IDiceCommandSetId } from "../dice/Dice";

export enum BlockType {
  Text = "Text",
  Numeric = "Numeric",
  Skill = "Skill",
  DicePool = "DicePool",
  PointCounter = "PointCounter",
  SlotTracker = "SlotTracker",
  Image = "Image",
  Link = "Link",
  Separator = "Separator",
}

export enum V3Position {
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
export type IV3Section = {
  id: string;
  label: string;
  position: V3Position;
  blocks: Array<IBlock>;
  visibleOnCard?: boolean;
};

export interface IV3Page {
  id: string;
  label: string;
  sections: Array<IV3Section>;
}

export interface IV3Character {
  id: string;
  name: string;
  group: string | undefined;
  pages: Array<IV3Page>;

  // hidden
  version: number;
  lastUpdated: number;
  playedDuringTurn?: boolean;
}

/**
 * V4
 */

export interface IV4Page {
  id: string;
  label: string;
  sections: { left: Array<ISection>; right: Array<ISection> };
}

export type IDefaultBlockMeta = {
  helperText?: string;
  /**
   * Column width from 0 to 1
   */
  width?: number;
};

export type ITextBlock = {
  type: BlockType.Text;
  meta: IDefaultBlockMeta & {
    checked?: boolean;
  };
  value: string;
};

export type INumericBlock = {
  type: BlockType.Numeric;
  meta: IDefaultBlockMeta & {
    checked?: boolean;
  };
  value: string;
};

export type ISkillBlock = {
  type: BlockType.Skill;
  meta: IDefaultBlockMeta & {
    checked?: boolean;
    commands?: Array<IDiceCommandSetId>;
    hideModifier?: boolean;
  };
  value: string;
};

export type IDicePoolBlock = {
  type: BlockType.DicePool;
  meta: IDefaultBlockMeta & {
    checked?: boolean;
    commands?: Array<IDiceCommandSetId>;
  };
  value: string;
};

export type ISlotTrackerBlock = {
  type: BlockType.SlotTracker;
  meta: IDefaultBlockMeta & {
    asClock?: boolean;
  };
  value: Array<{
    label: string;
    checked?: boolean;
  }>;
};

export type IPointCounterBlock = {
  type: BlockType.PointCounter;
  meta: IDefaultBlockMeta & {
    isMainPointCounter: boolean;
    max: string | undefined;
  };
  value: string;
};

export type IImageBlock = {
  type: BlockType.Image;
  meta: IDefaultBlockMeta & {};
  value: string;
};

export type ILinkBlock = {
  type: BlockType.Link;
  meta: IDefaultBlockMeta & {
    hasDisplayName: boolean;
  };
  value: string;
};

export type ISeparatorBlock = {
  type: BlockType.Separator;
  value: unknown;
  meta: IDefaultBlockMeta & {
    hasLabel: boolean;
    hideDivider?: boolean;
  };
};

export type IBlockTypes =
  | ITextBlock
  | INumericBlock
  | ISkillBlock
  | IDicePoolBlock
  | ISlotTrackerBlock
  | IPointCounterBlock
  | IImageBlock
  | ILinkBlock
  | ISeparatorBlock;

export type IBlock = {
  type: BlockType;
  id: string;
  label: string;
  value: unknown;
} & IBlockTypes;

export interface IV4Page {
  id: string;
  label: string;
  sections: { left: Array<ISection>; right: Array<ISection> };
}

export type IPageSectionPosition = keyof IV4Page["sections"];

/**
 * @deprecated
 */
export interface IV4Character {
  id: string;
  name: string;
  group: string | undefined;
  wide: boolean;
  pages: Array<IV4Page>;

  // hidden
  version: number;
  lastUpdated: number;
  playedDuringTurn?: boolean;
}

export type ISection = {
  id: string;
  label: string;
  blocks: Array<IBlock>;
  visibleOnCard?: boolean;
};

export type IPageColumn = {
  sections: Array<ISection>;
};
export type IPageRow = {
  columns: Array<IPageColumn>;
};

export interface IPage {
  id: string;
  label: string;
  rows: Array<IPageRow>;
}

export interface ICharacter {
  id: string;
  name: string;
  group: string | undefined;
  wide: boolean;
  zoom?: number;
  pages: Array<IPage>;

  // hidden
  version: number;
  lastUpdated: number;
  playedDuringTurn?: boolean;
}
