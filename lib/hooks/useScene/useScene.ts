import produce from "immer";
import { isEqual } from "lodash";
import Peer from "peerjs";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { sanitizeContentEditable } from "../../components/ContentEditable/ContentEditable";
import { ILines } from "../../components/DrawArea/DrawArea";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { ICharacter, useCharacters } from "../../contexts/CharactersContext";
import {
  defaultSceneAspects,
  defaultSceneName,
  defaultSceneVersion,
  ISavableScene,
} from "../../contexts/ScenesContext";
import { Confetti } from "../../domains/confetti/Confetti";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { AspectType } from "./AspectType";
import { IAspect, IPlayer, IScene } from "./IScene";

const temporaryGMIdUntilFirstSync = "temporary-gm-id-until-first-sync";

type IProps = {
  userId: string;
  gameId?: string;
  charactersManager: ReturnType<typeof useCharacters>;
  sceneToLoad?: ISavableScene;
};

export function useScene(props: IProps) {
  const { userId, gameId, charactersManager, sceneToLoad } = props;
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
    },
    players: [],
    goodConfetti: 0,
    badConfetti: 0,
    sort: false,
    drawAreaLines: [],
    version: defaultSceneVersion,
    lastUpdated: new Date().getTime(),
  }));

  const dirty = useMemo(() => {
    if (!sceneToLoad) {
      return false;
    }

    const current: ISavableScene = {
      id: scene.id,
      name: scene.name,
      aspects: scene.aspects,
      version: scene.version,
      lastUpdated: scene.lastUpdated,
    };
    return !isEqual(sceneToLoad, current);
  }, [scene, sceneToLoad]);

  useEffect(() => {
    if (sceneToLoad) {
      // setLoadedScene(sceneToLoad)
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
        charactersManager.actions.upsert(p.character);
      });
    }
  }

  function newScene() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        draft.id = uuidV4();
        draft.name = defaultSceneName;
        draft.aspects = defaultSceneAspects;
        draft.version = defaultSceneVersion;
        draft.lastUpdated = new Date().getTime();

        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });
      })
    );
  }

  function resetScene() {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        draft.name = defaultSceneName;
        draft.aspects = defaultSceneAspects;
        everyone.forEach((p) => {
          p.playedDuringTurn = false;
        });
      })
    );
  }

  function setName(name: string) {
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
      const indexCard: HTMLSpanElement | null = document.querySelector(
        `#index-card-${id}`
      );
      if (indexCard) {
        indexCard.focus();
      }
    });
  }

  function removeAspect(id: string) {
    setScene(
      produce((draft: IScene) => {
        delete draft.aspects[id];
      })
    );
  }

  function resetAspect(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id] = defaultAspects[draft.aspects[id].type];
      })
    );
  }

  function updateAspectTitle(id: string, title: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].title = title;
      })
    );
  }

  function updateAspectContent(id: string, content: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].content = content;
      })
    );
  }

  function addAspectTrack(id: string, name: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].tracks.push({
          name: name,
          value: [{ checked: false, label: "1" }],
        });
      })
    );
  }

  function removeAspectTrack(id: string, indexToRemove: number) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].tracks = draft.aspects[id].tracks.filter(
          (track, index) => {
            return index !== indexToRemove;
          }
        );
      })
    );
  }

  function setAspectTrackName(
    id: string,
    index: number,
    newStressTrackName: string
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].tracks[index].name = newStressTrackName;
      })
    );
  }

  function addAspectTrackBox(id: string, index: number) {
    setScene(
      produce((draft: IScene) => {
        const numberOfBoxes = draft.aspects[id].tracks[index].value.length;
        draft.aspects[id].tracks[index].value.push({
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

  function toggleAspectTrackBox(id: string, index: number, boxIndex: number) {
    setScene(
      produce((draft: IScene) => {
        const oldValue =
          draft.aspects[id].tracks[index].value[boxIndex].checked;
        draft.aspects[id].tracks[index].value[boxIndex].checked = !oldValue;
      })
    );
  }

  function setStressBoxLabel(
    id: string,
    index: number,
    boxIndex: number,
    label: string
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].tracks[index].value[boxIndex].label = label;
      })
    );
  }

  function removeStressTrack(id: string, indexToRemove: number) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].tracks = draft.aspects[id].tracks.filter(
          (track, index) => {
            return index !== indexToRemove;
          }
        );
      })
    );
  }

  function updateAspectColor(id: string, color: IndexCardColorTypes) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].color = color;
      })
    );
  }

  function addAspectConsequence(id: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].consequences.push("");
      })
    );
  }

  function updateAspectConsequence(id: string, index: number, value: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[id].consequences[index] = value;
      })
    );
  }

  function updatePlayers(connections: Array<Peer.DataConnection>) {
    setScene(
      produce((draft: IScene) => {
        draft.players = connections.map((c) => {
          const meta: IPeerMeta = c.metadata;
          const refresh = meta?.character?.refresh ?? 3;

          const playerMatch = draft.players.find((p) => p.id === c.label);

          const rolls = playerMatch?.rolls ?? [];
          const fatePoints = playerMatch?.fatePoints ?? refresh;
          const playedDuringTurn = playerMatch?.playedDuringTurn ?? false;

          return {
            id: c.label,
            playerName: meta.playerName,
            character: meta.character,
            rolls: rolls,
            playedDuringTurn: playedDuringTurn,
            fatePoints: fatePoints,
          } as IPlayer;
        });
      })
    );
  }

  function addOfflinePlayer(playerName: string) {
    setScene(
      produce((draft: IScene) => {
        draft.players.push({
          id: uuidV4(),
          playerName: playerName,
          character: undefined,
          rolls: [],
          playedDuringTurn: false,
          fatePoints: 3,
        });
      })
    );
  }

  function addOfflineCharacter(character: ICharacter) {
    setScene(
      produce((draft: IScene) => {
        draft.players.push({
          id: uuidV4(),
          playerName: "",
          character: character,
          rolls: [],
          playedDuringTurn: false,
          fatePoints: character.refresh,
        });
      })
    );
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
    charactersManager.actions.upsert(character);
  }

  function updatePlayerFatePoints(id: string, fatePoints: number) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            p.fatePoints = fatePoints >= 0 ? fatePoints : 0;
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

  function setDrawAreaLines(lines: ILines) {
    setScene(
      produce((draft: IScene) => {
        draft.drawAreaLines = lines;
      })
    );
  }

  return {
    state: { scene, dirty },
    actions: {
      resetScene,
      newScene,
      safeSetScene,
      setName,
      addAspect,
      removeAspect,
      resetAspect,
      updateAspectTitle,
      updateAspectContent,
      addAspectTrack,
      removeAspectTrack,
      setAspectTrackName,
      addAspectTrackBox,
      removeAspectTrackBox,
      toggleAspectTrackBox,
      setStressBoxLabel,
      removeStressTrack,
      addAspectConsequence,
      updateAspectConsequence,
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
      setDrawAreaLines,
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
  tracks: [{ name: "Free Invoke", value: [{ label: "", checked: false }] }],
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
