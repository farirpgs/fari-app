import { PlayCursorMode } from "../consts/PlayCursorMode";

export type IPlayerCursorState =
  | {
      mode: PlayCursorMode.Hidden;
    }
  | {
      mode: PlayCursorMode.Chat;
      message: string;
      previousMessage: string | null;
    };
