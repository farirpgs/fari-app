import { ICharacter } from "../../../domains/character/types";
import { IDiceRollResult } from "../../../domains/dice/Dice";
import { IPeerAction } from "../../../hooks/usePeerJS/IPeerAction";
import { IIndexCard } from "../../../hooks/useScene/IScene";

export type IPeerActions =
  | IRollPeerAction
  | IUpdateFatePointPeerAction
  | IUpdateCharacterPeerAction
  | ILoadCharacterPeerAction
  | IUpdatePlayedInTurnOrderPeerAction
  | IUpdateIndexCard
  | IPauseSession;

type IRollPeerAction = IPeerAction<"roll", IDiceRollResult>;
type IUpdateFatePointPeerAction = IPeerAction<
  "update-main-point-counter",
  { points: string; maxPoints: string | undefined }
>;
type ILoadCharacterPeerAction = IPeerAction<"load-character", ICharacter>;
type IUpdateCharacterPeerAction = IPeerAction<"update-character", ICharacter>;
type IUpdatePlayedInTurnOrderPeerAction = IPeerAction<
  "played-in-turn-order",
  boolean
>;
type IPauseSession = IPeerAction<"pause", undefined>;
type IUpdateIndexCard = IPeerAction<
  "update-index-card",
  {
    indexCard: IIndexCard;
  }
>;
