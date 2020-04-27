import { IndexCardColor } from "../../../components/IndexCard/IndexCardColor";

export interface IPlayer {
  id: string;
  playerName: string;
  rolls: Array<number>;
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
