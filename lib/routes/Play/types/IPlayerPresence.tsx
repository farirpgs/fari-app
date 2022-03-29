import { IPlayerCursorRollOutput } from "./IPlayerCursorState";

export type IPlayerPresence = {
  cursor: {
    x: number;
    y: number;
  } | null;
  message: string;
  rollOutput: IPlayerCursorRollOutput | undefined;
  color: string | undefined;
  playerName: string | undefined;
  characterName: string | undefined;
};
