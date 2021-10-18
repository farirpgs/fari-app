import { ICharacter } from "../../../domains/character/types";
import { IDiceRollResult } from "../../../domains/dice/Dice";
import { IPlayer } from "../../../hooks/useScene/IScene";

export type IPlayerInteraction =
  | {
      type: "ping";
      payload: undefined;
    }
  | {
      type: "pong";
      payload: undefined;
    }
  | {
      type: "pause";
      payload: undefined;
    }
  | {
      type: "add-player";
      payload: {
        player: IPlayer;
      };
    }
  | {
      type: "update-player-points";
      payload: { id: string; points: string; maxPoints: string | undefined };
    }
  | {
      type: "update-player-roll";
      payload: { id: string; roll: IDiceRollResult };
    }
  | {
      type: "update-player-played-during-turn";
      payload: { id: string; playedDuringTurn: boolean };
    }
  | {
      type: "update-player-character";
      payload: { id: string; character: ICharacter };
    };

export const PlayerInteractionFactory = {
  ping(): IPlayerInteraction {
    return {
      type: "ping",
      payload: undefined,
    };
  },
  pong(): IPlayerInteraction {
    return {
      type: "pong",
      payload: undefined,
    };
  },
  pause(): IPlayerInteraction {
    return {
      type: `pause`,
      payload: undefined,
    };
  },
  addPlayer(id: string, name: string): IPlayerInteraction {
    const newPlayer: IPlayer = {
      id: id,
      playerName: name ?? "",
      character: undefined,
      rolls: [],
      isGM: false,
      points: "3",
      private: false,
      playedDuringTurn: false,
    };

    return {
      type: "add-player",
      payload: {
        player: newPlayer,
      },
    };
  },
  updatePlayerRolls(id: string, roll: IDiceRollResult): IPlayerInteraction {
    return {
      type: `update-player-roll`,
      payload: { id, roll },
    };
  },
  updatePlayerPoints(
    id: string,
    points: string,
    maxPoints: string | undefined
  ): IPlayerInteraction {
    return {
      type: `update-player-points`,
      payload: { id, points, maxPoints },
    };
  },
  updatePlayerPlayedDuringTurn(
    id: string,
    playedDuringTurn: boolean
  ): IPlayerInteraction {
    return {
      type: `update-player-played-during-turn`,
      payload: { id, playedDuringTurn },
    };
  },
  updatePlayerCharacter(id: string, character: ICharacter): IPlayerInteraction {
    return {
      type: `update-player-character`,
      payload: { id, character },
    };
  },
};
