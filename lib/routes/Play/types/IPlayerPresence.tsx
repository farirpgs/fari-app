import { IPlayerCursorRollOutput } from "./IPlayerCursorState";

export type IPlayerPresence = {
  cursor: {
    x: number;
    y: number;
  } | null;
  message: string | null;
  rollOutput: IPlayerCursorRollOutput | null;
  color: string | null;
  playerName: string | null;
  characterName: string | null;
};
