import {
  defaultSceneName,
  defaultSceneVersion,
} from "../../contexts/SceneContext/ScenesContext";
import { AspectType } from "../../hooks/useScene/AspectType";
import { IIndexCard, IScene, ISceneV1 } from "../../hooks/useScene/IScene";
import { BlockType, IBlock } from "../character/types";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../Id/Id";

export const SceneFactory = {
  make(gmId: string): IScene {
    return {
      id: Id.generate(),
      name: defaultSceneName,
      group: undefined,
      indexCards: [],
      gm: {
        id: gmId,
        playerName: "Game Master",
        rolls: [],
        playedDuringTurn: false,
        points: "3",
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
  makeIndexCard(type: AspectType, isPrivate: boolean): IIndexCard {
    const indexCardDefault: Record<AspectType, IIndexCard> = {
      [AspectType.Aspect]: {
        id: Id.generate(),
        title: "",
        content: "<br/>",
        color: "white",
        type: AspectType.Aspect,
        playedDuringTurn: false,
        pinned: false,
        blocks: [],
        subCards: [],
      },
      [AspectType.Boost]: {
        id: Id.generate(),
        title: "",
        content: "<br/>",
        color: "blue",
        type: AspectType.Boost,
        playedDuringTurn: false,
        pinned: false,
        blocks: [],
        subCards: [],
      },
      [AspectType.BadGuy]: {
        id: Id.generate(),
        title: "",
        content: "<br/>",
        color: "red",
        type: AspectType.BadGuy,
        playedDuringTurn: false,
        pinned: false,
        blocks: [],
        subCards: [],
      },
      [AspectType.NPC]: {
        id: Id.generate(),
        title: "",
        content: "<br/>",
        color: "green",
        type: AspectType.NPC,
        playedDuringTurn: false,
        pinned: false,
        blocks: [],
        subCards: [],
      },
      [AspectType.IndexCard]: {
        id: Id.generate(),
        title: "",
        content: "<br/>",
        color: "white",
        type: AspectType.IndexCard,
        playedDuringTurn: false,
        pinned: false,
        blocks: [],
        subCards: [],
      },
    };

    return indexCardDefault[type];
  },
  migrate(s: any): IScene {
    try {
      const v2: IScene = migrateV1SceneToV2(s);
      return v2;
    } catch (error) {
      console.error(error);
      return s;
    }
  },
};

function migrateV1SceneToV2(v1: ISceneV1): IScene {
  if (v1.version !== 1) {
    return (v1 as unknown) as IScene;
  }

  return {
    version: 2,
    id: v1.id,
    name: v1.name,
    group: v1.group,
    indexCards: Object.keys(v1.aspects).map(
      (aspectId): IIndexCard => {
        const aspect = v1.aspects[aspectId];
        const blocks: Array<IBlock> = [];

        for (const track of aspect.tracks) {
          blocks.push({
            id: Id.generate(),
            type: BlockType.SlotTracker,
            label: track.name,
            value: track.value,
            meta: {},
          });
        }

        for (const track of aspect.consequences) {
          blocks.push({
            id: Id.generate(),
            type: BlockType.Text,
            label: track.name,
            value: track.value,
            meta: {},
          });
        }

        return {
          id: aspectId,
          title: aspect.title,
          content: aspect.content,
          color: aspect.color,
          playedDuringTurn: aspect.playedDuringTurn,
          type: aspect.type,
          pinned: aspect.pinned,
          isPrivate: aspect.isPrivate,
          blocks: blocks,
          subCards: [],
        };
      }
    ),
    gm: v1.gm,
    players: v1.players,
    goodConfetti: v1.goodConfetti,
    badConfetti: v1.badConfetti,
    sort: v1.sort,
    drawAreaObjects: v1.drawAreaObjects,
    lastUpdated: v1.lastUpdated,
    notes: v1.notes,
  };
}
