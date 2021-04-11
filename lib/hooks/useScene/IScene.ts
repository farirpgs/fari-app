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
  offline: boolean;
  isGM: boolean;
  points: string;
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
  title: string;
  content: string;
  color: IndexCardColorTypes;
  playedDuringTurn: boolean;
  type: AspectType;
  blocks: Array<IBlock>;
  /**
   * @default false
   */
  pinned: boolean | undefined;
  /**
   * @default false
   */
  isPrivate?: boolean;
  subCards: Array<ISubIndexCards>;
}

type ISubIndexCards = {
  id: string;
  title: string;
  content: string;
  color: IndexCardColorTypes;
  playedDuringTurn: boolean;
  type: AspectType;
  blocks: Array<IBlock>;
};

export interface IScene {
  id: string;
  name: string;
  group: string | undefined;
  indexCards: Array<IIndexCard>;
  gm: IPlayer;
  players: Array<IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  sort: boolean;
  drawAreaObjects: IDrawAreaObjects;
  version: number;
  lastUpdated: number;
  notes?: string;
}
