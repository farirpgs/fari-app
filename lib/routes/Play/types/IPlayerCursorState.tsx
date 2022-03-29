import { PlayCursorMode } from "../consts/PlayCursorMode";

export type IPlayerCursorState = {
  mode: PlayCursorMode;
  message?: string;
  rollOutput?: IPlayerCursorRollOutput;
};
// | {
//     mode: PlayCursorMode.Hidden;
//   }
// | {
//     mode: PlayCursorMode.Chat;
//     message: string | undefined;
//     rollOutput: string | undefined;
//   };

export type IPlayerCursorRollOutput = {
  text: string;
  total: string;
};
