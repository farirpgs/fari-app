import { PlayCursorMode } from "../consts/PlayCursorMode";

export type IPlayerCursorState =
  | {
      mode: PlayCursorMode.Hidden;
    }
  | {
      mode: PlayCursorMode.Chat;
      message: string | null;
      rollOutput: IPlayerCursorRollOutput | null;
    };

export type IPlayerCursorRollOutput = {
  text: string;
  total: string;
};
