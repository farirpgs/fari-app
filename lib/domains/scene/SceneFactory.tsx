import {
  defaultSceneAspects,
  defaultSceneName,
  defaultSceneVersion,
} from "../../contexts/SceneContext/ScenesContext";
import { IScene } from "../../hooks/useScene/IScene";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../Id/Id";

export const SceneFactory = {
  make(gmId: string): IScene {
    return {
      id: Id.generate(),
      name: defaultSceneName,
      group: undefined,
      aspects: defaultSceneAspects,
      gm: {
        id: gmId,
        playerName: "Game Master",
        rolls: [],
        playedDuringTurn: false,

        offline: false,
        isGM: true,
      },
      players: [],
      goodConfetti: 0,
      badConfetti: 0,
      sort: false,
      drawAreaObjects: [],
      version: defaultSceneVersion,
      lastUpdated: getUnix(),
    };
  },
};
