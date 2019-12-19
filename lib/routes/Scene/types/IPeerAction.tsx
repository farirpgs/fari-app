export interface IPeerAction {
  type:
    | "UPDATE_SCENE_IN_PLAYER_SCREEN"
    | "UPDATE_CHARACTER_IN_GM_SCREEN"
    | "SEND_MESSAGE_TO_GM"
    | "SYNC_MESSAGES_TO_PLAYERS";
  payload: any;
}
