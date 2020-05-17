import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { IPeerAction } from "../../hooks/usePeerJS/IPeerAction";

export type IPeerActions =
  | IRollPeerAction
  | IUpdateFatePointPeerAction
  | IUpdatePlayedInTurnOrderPeerAction;

type IRollPeerAction = IPeerAction<"roll", IDiceRoll>;
type IUpdateFatePointPeerAction = IPeerAction<"update-fate-point", number>;
type IUpdatePlayedInTurnOrderPeerAction = IPeerAction<
  "played-in-turn-order",
  boolean
>;
