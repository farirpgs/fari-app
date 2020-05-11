import { IndexCardColor } from "../../../components/IndexCard/IndexCardColor";
import { IDiceRoll } from "../../../domains/dice/IDiceRoll";

export interface IPlayer {
  id: string;
  playerName: string;
  rolls: Array<IDiceRoll>;
  playedDuringTurn: boolean;
  fatePoints: number;
}

export interface IAspect {
  title: string;
  content: string;
  freeInvokes: Array<boolean>;
  physicalStress: Array<boolean>;
  mentalStress: Array<boolean>;
  consequences: Array<string>;
  color: IndexCardColor;
  isBoost: boolean;
}

export interface IScene {
  name: string;
  aspects: Record<string, IAspect>;
  gm: IPlayer;
  players: Array<IPlayer>;
}
