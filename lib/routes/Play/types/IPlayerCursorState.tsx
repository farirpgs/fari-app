import { PlayCursorMode } from "../consts/PlayCursorMode";

export type IPlayerCursorState =
  | {
      mode: PlayCursorMode.Hidden;
    }
  | {
      mode: PlayCursorMode.Chat;
      message: string | null | undefined;
      rollOutput: IPlayerCursorRollOutput | null | undefined;
    };

export type IPlayerCursorRollOutput = {
  text: string;
  total: string;
};
