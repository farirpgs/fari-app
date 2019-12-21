export type ISendToPlayersActions = "SYNC_SCENE";

export type ISendToHostActions = "UPDATE_CHARACTER" | "SEND_MESSAGE";

export interface IPeerAction {
  type: ISendToPlayersActions | ISendToHostActions;
  payload: any;
}
