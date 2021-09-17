import { IDrawAreaObjects } from "../../components/DrawArea/hooks/useDrawing";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { IBlock, ICharacter } from "../../domains/character/types";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { AspectType } from "./AspectType";

export interface IPlayer {
  id: string;
  playerName?: string;
  character?: ICharacter;
  rolls: Array<IDiceRollResult>;
  playedDuringTurn: boolean;
  isGM: boolean;
  points: string;
  private: boolean;
}

/**
 * @deprecated
 */
export interface IAspectV1 {
  title: string;
  content: string;
  tracks: Array<{
    name: string;
    value: Array<{ checked?: boolean; label: string }>;
  }>;
  consequences: Array<{ name: string; value: string }>;
  color: IndexCardColorTypes;
  playedDuringTurn: boolean;
  drawAreaObjects?: IDrawAreaObjects;
  type: AspectType;
  /**
   * @default false
   */
  pinned: boolean | undefined;
  /**
   * @default false
   */
  isPrivate?: boolean;
}

/**
 * @deprecated
 */
export interface ISceneV1 {
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
  drawAreaObjects: IDrawAreaObjects;
}

export interface IIndexCard {
  id: string;
  titleLabel: string;
  title: string;
  contentLabel: string;
  content: string;
  color: string;
  playedDuringTurn: boolean;
  blocks: Array<IBlock>;
  /**
   * @default false
   */
  pinned: boolean | undefined;

  subCards: Array<IIndexCard>;
  sub: boolean;
}

export type IIndexCardType = "public" | "private";

export interface IScene {
  id: string;
  name: string;
  group: string | undefined;
  indexCards: Record<IIndexCardType, Array<IIndexCard>>;
  version: number;
  lastUpdated: number;
  notes?: string;
}

export type IGM = IPlayer & {
  npcs: Array<IPlayer>;
};

export interface ISession {
  gm: IGM;
  players: Array<IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  drawAreaObjects: IDrawAreaObjects;
  paused: boolean;
}
