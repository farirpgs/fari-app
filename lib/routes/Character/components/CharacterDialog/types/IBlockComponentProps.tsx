import {
  IBlock,
  IBlockTypes,
  ISection,
} from "../../../../../domains/character/types";

export type IBlockComponentProps<TBlockType extends IBlockTypes> = {
  advanced: boolean;
  readonly: boolean | undefined;
  pageIndex: number;
  sectionIndex: number;
  section: ISection;
  block: IBlock & TBlockType;
  blockIndex: number;
  onLabelChange(label: string): void;
  onValueChange(value: string): void;
  onMetaChange(meta: TBlockType["meta"]): void;
};

export type IBlockActionComponentProps<TBlockType extends IBlockTypes> = {
  pageIndex: number;
  sectionIndex: number;
  section: ISection;
  block: IBlock & TBlockType;
  blockIndex: number;
  onMetaChange(meta: TBlockType["meta"]): void;
};
