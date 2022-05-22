import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { IBlock, ICharacter } from "../../domains/character/types";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { IDrawingAreaState } from "../../routes/Draw/TldrawWriterAndReader";
import { AspectType } from "./AspectType";

export type IPlayer = {
  id: string;
  playerName?: string;
  rolls: Array<IDiceRollResult>;
  playedDuringTurn: boolean;
  isGM: boolean;
  points: string;
  private: boolean;
  color: string;
};

/**
 * @deprecated
 */
export type IAspectV1 = {
  title: string;
  content: string;
  tracks: Array<{
    name: string;
    value: Array<{ checked?: boolean; label: string }>;
  }>;
  consequences: Array<{ name: string; value: string }>;
  color: IndexCardColorTypes;
  playedDuringTurn: boolean;
  type: AspectType;
  /**
   * @default false
   */
  pinned: boolean | undefined;
  /**
   * @default false
   */
  isPrivate?: boolean;
};

/**
 * @deprecated
 */
export type ISceneV1 = {
  id: string;
  name: string;
  group: string | undefined;
  aspects: Record<string, IAspectV1>;
  gm: IPlayer;
  players: Array<IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  sort: boolean;
  version: number;
  lastUpdated: number;
  notes?: string;
  drawAreaObjects: any;
};

/**
 * @deprecated
 */
export type IIndexCardForV2Scene = {
  id: string;
  title: string;
  titleLabel: string;
  contentLabel?: string;
  content?: string;
  color: string;
  playedDuringTurn: boolean;
  blocks: Array<IBlock>;
  /**
   * @default false
   */
  pinned: boolean | undefined;

  subCards: Array<IIndexCardForV2Scene>;
  sub: boolean;
};

export type IIndexCard = {
  id: string;
  titleLabel: string;
  title: string;
  color: string;
  playedDuringTurn: boolean;
  blocks: Array<IBlock>;
  /**
   * @default false
   */
  pinned: boolean | undefined;

  subCards: Array<IIndexCard>;
  sub: boolean;
};

export type IIndexCardType = "public" | "private";

export type IV2Scene = {
  id: string;
  name: string;
  group: string | undefined;
  indexCards: Record<IIndexCardType, Array<IIndexCardForV2Scene>>;
  version: number;
  lastUpdated: number;
  notes?: string;
};

export type IScene = {
  id: string;
  name: string;
  group: string | undefined;
  indexCards: Record<IIndexCardType, Array<IIndexCard>>;
  version: number;
  lastUpdated: number;
  notes?: string;
};

export type IGM = IPlayer & {
  npcs: Array<IPlayer>;
};

export type ISession = {
  gm: IGM;
  players: Record<string, IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  tlDrawDoc: IDrawingAreaState;
  paused: boolean;
};

export type ISessionCharacters = {
  characters: Record<string, ICharacter>;
};
