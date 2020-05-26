import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { IPeerAction } from "../../hooks/usePeerJS/IPeerAction";
import { ICharacter } from "../Characters/hooks/useCharacters";

export type IPeerActions =
  | IRollPeerAction
  | IUpdateFatePointPeerAction
  | IUpdateCharacterPeerAction
  | IUpdatePlayedInTurnOrderPeerAction;

type IRollPeerAction = IPeerAction<"roll", IDiceRoll>;
type IUpdateFatePointPeerAction = IPeerAction<"update-fate-point", number>;
type IUpdateCharacterPeerAction = IPeerAction<"update-character", ICharacter>;
type IUpdatePlayedInTurnOrderPeerAction = IPeerAction<
  "played-in-turn-order",
  boolean
>;
