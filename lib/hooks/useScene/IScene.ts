import { ILines } from "../../components/DrawArea/DrawArea";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { ICharacter } from "../../contexts/CharactersContext";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { AspectType } from "./AspectType";

export interface IPlayer {
  id: string;
  playerName?: string;
  character?: ICharacter;
  rolls: Array<IDiceRoll>;
  playedDuringTurn: boolean;
  fatePoints: number;
}

export interface IAspect {
  title: string;
  content: string;
  freeInvokes: Array<boolean>;
  countdown: Array<boolean>;
  physicalStress: Array<boolean>;
  mentalStress: Array<boolean>;
  consequences: Array<string>;
  color: IndexCardColorTypes;
  playedDuringTurn: boolean;
  type: AspectType;
}

export interface IScene {
  id: string;
  name: string;
  aspects: Record<string, IAspect>;
  gm: IPlayer;
  players: Array<IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  sort: boolean;
  drawAreaLines: ILines;
  version: number;
  lastUpdated: number;
}
