import { ICharacter } from "../../../domains/character/types";
import { IDiceRollWithBonus } from "../../../domains/dice/Dice";
import { IPeerAction } from "../../../hooks/usePeerJS/IPeerAction";

export type IPeerActions =
  | IRollPeerAction
  | IUpdateFatePointPeerAction
  | IUpdateCharacterPeerAction
  | ILoadCharacterPeerAction
  | IUpdatePlayedInTurnOrderPeerAction;

type IRollPeerAction = IPeerAction<"roll", IDiceRollWithBonus>;
type IUpdateFatePointPeerAction = IPeerAction<
  "update-main-point-counter",
  number
>;
type ILoadCharacterPeerAction = IPeerAction<"load-character", ICharacter>;
type IUpdateCharacterPeerAction = IPeerAction<"update-character", ICharacter>;
type IUpdatePlayedInTurnOrderPeerAction = IPeerAction<
  "played-in-turn-order",
  boolean
>;
