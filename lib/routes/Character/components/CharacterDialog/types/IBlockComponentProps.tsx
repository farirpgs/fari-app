import { IBlock, IBlockTypes } from "../../../../../domains/character/types";

export type IBlockComponentProps<TBlockType extends IBlockTypes> = {
  dataCy: string;
  advanced: boolean;
  readonly: boolean | undefined;
  block: IBlock & TBlockType;
  onLabelChange(label: string): void;
  onValueChange(value: TBlockType["value"]): void;
  onMetaChange(meta: TBlockType["meta"]): void;
};

export type IBlockActionComponentProps<TBlockType extends IBlockTypes> = {
  block: IBlock & TBlockType;
  onMetaChange(meta: TBlockType["meta"]): void;
};
