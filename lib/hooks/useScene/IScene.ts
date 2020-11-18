import { IDrawAreaObjects } from "../../components/DrawArea/hooks/useDrawing";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { ICharacter } from "../../contexts/CharactersContext/CharactersContext";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { AspectType } from "./AspectType";

export interface IPlayer {
  id: string;
  playerName?: string;
  character?: ICharacter;
  rolls: Array<IDiceRoll>;
  playedDuringTurn: boolean;
  fatePoints: number;
  offline: boolean;
}

export interface IAspect {
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
  pinned: boolean | undefined;
}

export interface IScene {
  id: string;
  name: string;
  group: string | undefined;
  aspects: Record<string, IAspect>;
  gm: IPlayer;
  players: Array<IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  sort: boolean;
  drawAreaObjects: IDrawAreaObjects;
  version: number;
  lastUpdated: number;
}
