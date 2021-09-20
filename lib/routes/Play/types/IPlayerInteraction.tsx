import { ICharacter } from "../../../domains/character/types";
import { IDiceRollResult } from "../../../domains/dice/Dice";

export type IPlayerInteraction = {
  type: string;
  payload: any;
};

export const PlayerInteractionFactory = {
  pauseInteraction(payload: boolean) {
    return {
      type: `/info/paused`,
      payload,
    };
  },
  updatePlayerPoints(id: string, points: string): IPlayerInteraction {
    return {
      type: `/info/players/${id}/points`,
      payload: points,
    };
  },
  updatePlayerRolls(
    id: string,
    rolls: Array<IDiceRollResult>
  ): IPlayerInteraction {
    return {
      type: `/info/players/${id}/rolls`,
      payload: rolls,
    };
  },
  updatePlayerMaxPoints(
    id: string,
    maxPoints: string | undefined
  ): IPlayerInteraction {
    return {
      type: `/info/players/${id}/maxPoints`,
      payload: maxPoints || null,
    };
  },
  updatePlayerPlayedDuringTurn(
    id: string,
    playedDuringTurn: boolean
  ): IPlayerInteraction {
    return {
      type: `/info/players/${id}/playedDuringTurn`,
      payload: playedDuringTurn,
    };
  },
  updatePlayerCharacter(id: string, character: ICharacter): IPlayerInteraction {
    return {
      type: `/info/players/${id}/character`,
      payload: character,
    };
  },
};
