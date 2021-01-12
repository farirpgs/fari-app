import { ICharacter } from "../../../contexts/CharactersContext/CharactersContext";
import { IDiceRoll } from "../../../domains/dice/IDiceRoll";
import { IPeerAction } from "../../../hooks/usePeerJS/IPeerAction";

export type IPeerActions =
  | IRollPeerAction
  | IUpdateFatePointPeerAction
  | IUpdateCharacterPeerAction
  | ILoadCharacterPeerAction
  | IUpdatePlayedInTurnOrderPeerAction;

type IRollPeerAction = IPeerAction<"roll", IDiceRoll>;
type IUpdateFatePointPeerAction = IPeerAction<"update-fate-point", number>;
type ILoadCharacterPeerAction = IPeerAction<"load-character", ICharacter>;
type IUpdateCharacterPeerAction = IPeerAction<"update-character", ICharacter>;
type IUpdatePlayedInTurnOrderPeerAction = IPeerAction<
  "played-in-turn-order",
  boolean
>;
