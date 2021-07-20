import {
  IndexCardColor,
  IndexCardColorTypes,
} from "../../components/IndexCard/IndexCardColor";
import {
  defaultSceneName,
  defaultSceneVersion,
} from "../../contexts/SceneContext/ScenesContext";
import { AspectType } from "../../hooks/useScene/AspectType";
import {
  IAspectV1,
  IIndexCard,
  IScene,
  ISceneV1,
} from "../../hooks/useScene/IScene";
import { BlockType, IBlock } from "../character/types";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../Id/Id";

export const SceneFactory = {
  make(): IScene {
    return {
      id: Id.generate(),
      name: defaultSceneName,
      group: undefined,
      indexCards: {
        public: [],
        private: [],
      },
      version: defaultSceneVersion,
      lastUpdated: getUnix(),
    };
  },
  makeSavableScene(): IScene {
    return {
      id: Id.generate(),
      name: defaultSceneName,
      group: undefined,
      indexCards: {
        public: [],
        private: [],
      },
      version: defaultSceneVersion,
      lastUpdated: getUnix(),
    };
  },
  makeIndexCard(): IIndexCard {
    return {
      id: Id.generate(),
      titleLabel: "Index Card",
      title: "",
      contentLabel: "Notes",
      content: "",
      color: "#fff",
      playedDuringTurn: false,
      pinned: false,
      blocks: [],
      subCards: [],
      sub: false,
    };
  },
  makeSubIndexCard(): IIndexCard {
    return {
      id: Id.generate(),
      titleLabel: "Index Card",
      title: "",
      contentLabel: "Notes",
      content: "",
      color: "#fff",
      playedDuringTurn: false,
      pinned: false,
      blocks: [],
      subCards: [],
      sub: true,
    };
  },
  duplicate(scene: IScene): IScene {
    return {
      ...scene,
      id: Id.generate(),
      lastUpdated: getUnix(),
      name: `${scene.name} Copy`,
    };
  },
  makeATemplate(scene: IScene): Omit<IScene, "id"> & { id: undefined } {
    return {
      ...scene,
      id: undefined,
      lastUpdated: getUnix(),
      name: `${scene.name} Template`,
    };
  },
  duplicateIndexCard(indexCard: IIndexCard): IIndexCard {
    return {
      ...indexCard,
      id: Id.generate(),
      subCards: indexCard.subCards.map((sub) => {
        return {
          ...sub,
          id: Id.generate(),
        };
      }),
    };
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
    return v1 as unknown as IScene;
  }

  const publicIndexCards: Array<IIndexCard> = [];
  const privateIndexCards: Array<IIndexCard> = [];

  for (const [aspectId, aspect] of Object.entries(v1.aspects)) {
    const indexCard = aspectToIndexCard(aspect, aspectId);

    if (aspect.isPrivate) {
      privateIndexCards.push(indexCard);
    } else {
      publicIndexCards.push(indexCard);
    }
  }

  return {
    version: 2,
    id: v1.id,
    name: v1.name,
    group: v1.group,
    indexCards: {
      public: publicIndexCards,
      private: privateIndexCards,
    },
    lastUpdated: v1.lastUpdated,
    notes: v1.notes,
  };
}

function aspectToIndexCard(aspect: IAspectV1, aspectId: string): IIndexCard {
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

  const headerRecord: Record<AspectType, string> = {
    [AspectType.Aspect]: "Aspect",
    [AspectType.Boost]: "Aspect",
    [AspectType.BadGuy]: "Aspect",
    [AspectType.NPC]: "Aspect",
    [AspectType.IndexCard]: "",
  };
  const colorRecord: { [key in IndexCardColorTypes]?: string } = {
    white: IndexCardColor.white,
    blue: IndexCardColor.blue,
    green: IndexCardColor.green,
    red: IndexCardColor.red,
    yellow: IndexCardColor.yellow,
  };

  return {
    id: aspectId,
    titleLabel: headerRecord[aspect.type],
    title: aspect.title,
    contentLabel: "Notes",
    content: aspect.content,
    color: colorRecord[aspect.color] as string,
    playedDuringTurn: aspect.playedDuringTurn,
    pinned: aspect.pinned,
    blocks: blocks,
    subCards: [],
    sub: false,
  };
}
