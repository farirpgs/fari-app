import { ICharacter } from "../../../domains/character/types";
import {
  IIndexCard,
  IIndexCardType,
  IPlayer,
} from "../../../hooks/useScene/IScene";
import { IMessage } from "../components/Chat/useChat";
import { DefaultPlayerColor } from "../consts/PlayerColors";

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
      type: "update-index-card";
      payload: {
        indexCardType: IIndexCardType;
        indexCard: IIndexCard;
      };
    }
  | {
      type: "update-player-status";
      payload: { id: string; status: string };
    }
  | {
      type: "update-player-character";
      payload: { id: string; character: ICharacter };
    }
  | {
      type: "send-message";
      payload: {
        message: IMessage;
      };
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
      isGM: false,
      points: "3",
      private: false,
      color: DefaultPlayerColor,
      status: "",
    };

    return {
      type: "add-player",
      payload: {
        player: newPlayer,
      },
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
  updatePlayerStatus(id: string, status: string): IPlayerInteraction {
    return {
      type: `update-player-status`,
      payload: { id, status },
    };
  },
  updatePlayerCharacter(id: string, character: ICharacter): IPlayerInteraction {
    return {
      type: `update-player-character`,
      payload: { id, character },
    };
  },
  sendMessage(message: IMessage): IPlayerInteraction {
    return {
      type: `send-message`,
      payload: { message },
    };
  },
};
