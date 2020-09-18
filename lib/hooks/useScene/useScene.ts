import produce from "immer";
import { isEqual } from "lodash";
import Peer from "peerjs";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { sanitizeContentEditable } from "../../components/ContentEditable/ContentEditable";
import { IDrawAreaObjects } from "../../components/DrawArea/hooks/useDrawing";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import {
  ICharacter,
  useCharacters,
} from "../../contexts/CharactersContext/CharactersContext";
import {
  defaultSceneAspects,
  defaultSceneName,
  defaultSceneVersion,
  ISavableScene,
} from "../../contexts/SceneContext/ScenesContext";
import { Confetti } from "../../domains/confetti/Confetti";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { AspectType } from "./AspectType";
import { IAspect, IPlayer, IScene } from "./IScene";

const temporaryGMIdUntilFirstSync = "temporary-gm-id-until-first-sync";

type IProps = {
  userId: string;
  gameId?: string;
  charactersManager: ReturnType<typeof useCharacters>;
};

export function useScene(props: IProps) {
  const { userId, gameId, charactersManager } = props;
  const isGM = !gameId;
  const [scene, setScene] = useState<IScene>(() => ({
    id: uuidV4(),
    name: defaultSceneName,
    aspects: defaultSceneAspects,
    gm: {
      id: isGM ? userId : temporaryGMIdUntilFirstSync,
      playerName: "Game Master",
      rolls: [],
      playedDuringTurn: false,
      fatePoints: 3,
      offline: false,
    },
    players: [],
    goodConfetti: 0,
    badConfetti: 0,
    sort: false,
    drawAreaObjects: [],
    version: defaultSceneVersion,
    lastUpdated: new Date().getTime(),
  }));

  const [sceneToLoad, setSceneToLoad] = useState<ISavableScene | undefined>(
    undefined
  );

  const dirty = useMemo(() => {
    if (!sceneToLoad) {
      return false;
    }

    const currentScene: ISavableScene = {
      id: scene.id,
      name: scene.name,
      aspects: scene.aspects,
      version: scene.version,
      lastUpdated: scene.lastUpdated,
    };
    return !isEqual(sceneToLoad, currentScene);
  }, [scene, sceneToLoad]);

  useEffect(() => {
    if (sceneToLoad) {
      setScene(
        produce((draft: IScene) => {
          draft.id = sceneToLoad.id;
          draft.name = sceneToLoad.name;
          draft.aspects = sceneToLoad.aspects;
          draft.version = sceneToLoad.version;
          draft.lastUpdated = sceneToLoad.lastUpdated;
        })
      );
    }
  }, [sceneToLoad]);

  useEffect(() => {
    if (scene.goodConfetti > 0) {
      Confetti.fireConfetti();
      setScene(
        produce((draft: IScene) => {
          draft.goodConfetti = 0;
        })
      );
    }
  }, [scene.goodConfetti]);

  useEffect(() => {
    if (scene.badConfetti > 0) {
      Confetti.fireCannon();
      setScene(
        produce((draft: IScene) => {
          draft.badConfetti = 0;
        })
      );
    }
  }, [scene.badConfetti]);

  function safeSetScene(newScene: IScene) {
    if (newScene) {
      setScene(newScene);
      newScene.players.forEach((p) => {
        charactersManager.actions.updateIfExists(p.character);
      });
    }
  }

  function loadScene(newScene: ISavableScene) {
    if (newScene) {
      setSceneToLoad({
        id: newScene.id,
        name: newScene.name,
        aspects: newScene.aspects,
        lastUpdated: newScene.lastUpdated,
        version: newScene.version,
      });
    }
  }

  function cloneAndLoadScene(newScene: ISavableScene) {
    if (newScene) {
      const clonedNewScene = produce(newScene, (draft) => {
        draft.id = uuidV4();
      });
      loadScene(clonedNewScene);
    }
  }

  function resetScene() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        draft.name = defaultSceneName;
        draft.aspects = defaultSceneAspects;
        draft.drawAreaObjects = [];
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });
      })
    );
  }

  function updateName(name: string) {
    setScene(
      produce((draft: IScene) => {
        draft.name = name;
      })
    );
  }

  function addAspect(type: AspectType) {
    const id = uuidV4();
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id] = defaultAspects[type];
      })
    );
    setTimeout(() => {
      try {
        const indexCard: HTMLSpanElement | null = document.querySelector(
          `#index-card-${id}`
        );
        if (indexCard) {
          indexCard.focus();
        }
      } catch (error) {}
    });
  }

  function removeAspect(aspectId: string) {
    setScene(
      produce((draft: IScene) => {
        delete draft.aspects[aspectId];
      })
    );
  }

  function resetAspect(aspectId: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId] = defaultAspects[draft.aspects[aspectId].type];
      })
    );
  }

  function updateAspectTitle(aspectId: string, title: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].title = title;
      })
    );
  }

  function updateAspectContent(aspectId: string, content: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].content = content;
      })
    );
  }

  function addAspectTrack(aspectId: string, trackName: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].tracks.push({
          name: trackName,
          value: [{ checked: false, label: "1" }],
        });
      })
    );
  }

  function addAspectDrawArea(aspectId: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].drawAreaObjects = [];
      })
    );
  }

  function setAspectDrawAreaObjects(
    aspectId: string,
    objects: IDrawAreaObjects
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].drawAreaObjects = objects;
      })
    );
  }

  function removeAspectTrack(aspectId: string, trackIndex: number) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].tracks = draft.aspects[aspectId].tracks.filter(
          (track, index) => {
            return index !== trackIndex;
          }
        );
      })
    );
  }

  function updateAspectTrackName(
    aspectId: string,
    trackIndex: number,
    trackName: string
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].tracks[trackIndex].name = trackName;
      })
    );
  }

  function addAspectTrackBox(aspectId: string, trackIndex: number) {
    setScene(
      produce((draft: IScene) => {
        const numberOfBoxes =
          draft.aspects[aspectId].tracks[trackIndex].value.length;
        draft.aspects[aspectId].tracks[trackIndex].value.push({
          checked: false,
          label: `${numberOfBoxes + 1}`,
        });
      })
    );
  }

  function removeAspectTrackBox(id: string, index: number) {
    setScene(
      produce((draft: IScene) => {
        const numberOfBoxes = draft.aspects[id].tracks[index].value.length;
        draft.aspects[id].tracks[index].value = draft.aspects[id].tracks[
          index
        ].value.filter((value, index) => {
          return index !== numberOfBoxes - 1;
        });
      })
    );
  }

  function toggleAspectTrackBox(
    aspectId: string,
    trackIndex: number,
    boxIndex: number
  ) {
    setScene(
      produce((draft: IScene) => {
        const oldValue =
          draft.aspects[aspectId].tracks[trackIndex].value[boxIndex].checked;
        draft.aspects[aspectId].tracks[trackIndex].value[
          boxIndex
        ].checked = !oldValue;
      })
    );
  }

  function updateStressBoxLabel(
    aspectId: string,
    trackIndex: number,
    boxIndex: number,
    boxLabel: string
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].tracks[trackIndex].value[
          boxIndex
        ].label = boxLabel;
      })
    );
  }

  function updateAspectColor(aspectId: string, color: IndexCardColorTypes) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].color = color;
      })
    );
  }

  function addAspectConsequence(aspectId: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].consequences.push({ name: "", value: "" });
      })
    );
  }

  function updateAspectConsequenceName(
    aspectId: string,
    consequenceIndex: number,
    name: string
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].consequences[consequenceIndex].name = name;
      })
    );
  }

  function updateAspectConsequenceValue(
    aspectId: string,
    consequenceIndex: number,
    value: string
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].consequences[consequenceIndex].value = value;
      })
    );
  }

  function removeAspectConsequence(aspectId: string, consequenceIndex: number) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].consequences = draft.aspects[
          aspectId
        ].consequences.filter((track, index) => {
          return index !== consequenceIndex;
        });
      })
    );
  }

  function updatePlayers(connections: Array<Peer.DataConnection>) {
    setScene(
      produce((draft: IScene) => {
        const offlinePlayers = draft.players.filter((p) => p.offline);
        draft.players = connections.map((c) => {
          const meta: IPeerMeta = c.metadata;
          const characterFatePoints =
            meta?.character?.fatePoints ?? meta?.character?.refresh ?? 3;
          const characterPlayedDuringTurn =
            meta?.character?.playedDuringTurn ?? false;
          const playerMatch = draft.players.find((p) => p.id === c.label);

          const rolls = playerMatch?.rolls ?? [];
          const fatePoints = playerMatch?.fatePoints ?? characterFatePoints;
          const playedDuringTurn =
            playerMatch?.playedDuringTurn ?? characterPlayedDuringTurn;

          return {
            id: c.label,
            playerName: meta.playerName,
            character: meta.character,
            rolls: rolls,
            playedDuringTurn: playedDuringTurn,
            fatePoints: fatePoints,
            offline: false,
          } as IPlayer;
        });
        draft.players = [...draft.players, ...offlinePlayers];
      })
    );
  }

  function addOfflinePlayer(playerName: string) {
    const id = uuidV4();
    setScene(
      produce((draft: IScene) => {
        draft.players.push({
          id: id,
          playerName: playerName,
          character: undefined,
          rolls: [],
          playedDuringTurn: false,
          fatePoints: 3,
          offline: true,
        });
      })
    );
    return id;
  }

  function addOfflineCharacter(character: ICharacter) {
    const id = uuidV4();
    setScene(
      produce((draft: IScene) => {
        draft.players.push({
          id: id,
          playerName: "",
          character: character,
          rolls: [],
          playedDuringTurn: false,
          fatePoints: character.refresh,
          offline: true,
        });
      })
    );
    return id;
  }

  function removeOfflinePlayer(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.players = draft.players.filter((p) => p.id !== id);
      })
    );
  }

  function resetInitiative() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });

        const aspectIds = Object.keys(draft.aspects);
        aspectIds.forEach((id) => {
          draft.aspects[id].playedDuringTurn = false;
        });
      })
    );
  }

  function updatePlayerPlayedDuringTurn(
    id: string,
    playedInTurnOrder: boolean
  ) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            p.playedDuringTurn = playedInTurnOrder;

            if (p.character) {
              p.character.playedDuringTurn = playedInTurnOrder;
            }
          }
        });
      })
    );
  }

  function updatePlayerCharacter(id: string, character: ICharacter) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            p.character = character;
          }
        });
      })
    );
    charactersManager.actions.updateIfExists(character);
  }

  function updatePlayerFatePoints(id: string, fatePoints: number) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            const newFatePointsAmount = fatePoints >= 0 ? fatePoints : 0;
            p.fatePoints = newFatePointsAmount;

            if (p.character) {
              p.character.fatePoints = newFatePointsAmount;
            }
          }
        });
      })
    );
  }

  function updatePlayerRoll(id: string, roll: IDiceRoll) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((player) => {
          if (player.id === id) {
            player.rolls = [roll, ...player.rolls];
          }
        });
      })
    );
  }

  function fireGoodConfetti() {
    setScene(
      produce((draft: IScene) => {
        draft.goodConfetti++;
      })
    );
  }

  function fireBadConfetti() {
    setScene(
      produce((draft: IScene) => {
        draft.badConfetti++;
      })
    );
  }

  function updateAspectPlayerDuringTurn(id: string, playedDuringTurn: boolean) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].playedDuringTurn = playedDuringTurn;
      })
    );
  }

  function toggleSort() {
    setScene(
      produce((draft: IScene) => {
        draft.sort = !draft.sort;
      })
    );
  }

  function updateDrawAreaObjects(objects: IDrawAreaObjects) {
    setScene(
      produce((draft: IScene) => {
        draft.drawAreaObjects = objects;
      })
    );
  }

  return {
    state: {
      scene,
      dirty,
    },
    actions: {
      resetScene,
      safeSetScene,
      loadScene,
      cloneAndLoadScene,
      updateName,
      addAspect,
      removeAspect,
      resetAspect,
      updateAspectTitle,
      updateAspectContent,
      addAspectTrack,
      addAspectDrawArea,
      setAspectDrawAreaObjects,
      removeAspectTrack,
      updateAspectTrackName,
      addAspectTrackBox,
      removeAspectTrackBox,
      toggleAspectTrackBox,
      updateStressBoxLabel,
      addAspectConsequence,
      updateAspectConsequenceName,
      updateAspectConsequenceValue,
      removeAspectConsequence,
      updateAspectPlayerDuringTurn,
      updateAspectColor,
      updatePlayers,
      addOfflinePlayer,
      addOfflineCharacter,
      removeOfflinePlayer,
      updatePlayerFatePoints,
      updatePlayerPlayedDuringTurn,
      resetInitiative,
      updatePlayerRoll,
      fireGoodConfetti,
      fireBadConfetti,
      toggleSort,
      updatePlayerCharacter,
      updateDrawAreaObjects,
    },
  };
}

const defaultAspect: IAspect = {
  title: "",
  content: "<br/>",
  tracks: [],
  consequences: [],
  color: "white",
  type: AspectType.Aspect,
  playedDuringTurn: false,
};
const defaultIndexCard: IAspect = {
  title: "",
  content: "<br/>",
  tracks: [],
  consequences: [],
  color: "white",
  type: AspectType.IndexCard,
  playedDuringTurn: false,
};

const defaultBoost: IAspect = {
  title: "",
  content: "<br/>",
  tracks: [{ name: "Free Invoke", value: [{ label: "1", checked: false }] }],
  consequences: [],
  color: "blue",
  type: AspectType.Boost,
  playedDuringTurn: false,
};

const defaultNPC: IAspect = {
  title: "",
  content: "<br/>",
  tracks: [],
  consequences: [],
  color: "green",
  type: AspectType.NPC,
  playedDuringTurn: false,
};

const defaultBadGuy: IAspect = {
  title: "",
  content: "<br/>",
  tracks: [],
  consequences: [],
  color: "red",
  type: AspectType.BadGuy,
  playedDuringTurn: false,
};

const defaultAspects: Record<AspectType, IAspect> = {
  [AspectType.Aspect]: defaultAspect,
  [AspectType.Boost]: defaultBoost,
  [AspectType.NPC]: defaultNPC,
  [AspectType.BadGuy]: defaultBadGuy,
  [AspectType.IndexCard]: defaultIndexCard,
};

export function sanitizeSceneName(sceneName: string) {
  return sceneName === defaultSceneName
    ? ""
    : sanitizeContentEditable(sceneName);
}

export interface IPeerMeta {
  playerName?: string;
  character?: ICharacter;
}
