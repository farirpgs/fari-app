import produce from "immer";
import isEqual from "lodash/isEqual";
import Peer from "peerjs";
import { useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { IDrawAreaObjects } from "../../components/DrawArea/hooks/useDrawing";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { useCharacters } from "../../contexts/CharactersContext/CharactersContext";
import {
  defaultSceneName,
  ISavableScene,
} from "../../contexts/SceneContext/ScenesContext";
import { arraySort } from "../../domains/array/arraySort";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPointCounterBlock,
} from "../../domains/character/types";
import { Confetti } from "../../domains/confetti/Confetti";
import { getUnix } from "../../domains/dayjs/getDayJS";
import { IDiceRollResult } from "../../domains/dice/Dice";
import { Id } from "../../domains/Id/Id";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { AspectType } from "./AspectType";
import { IAspectV1, IPlayer, IScene } from "./IScene";

const temporaryGMIdUntilFirstSync = "temporary-gm-id-until-first-sync";

type IProps = {
  userId: string;
  gameId?: string;
  charactersManager: ReturnType<typeof useCharacters>;
};

export function useScene(props: IProps) {
  const { userId, gameId, charactersManager } = props;
  const isGM = !gameId;
  const [removedPlayers, setRemovedPlayers] = useState([]);
  const [scene, setScene] = useState<IScene>(() => {
    const gmId = isGM ? userId : temporaryGMIdUntilFirstSync;
    return SceneFactory.make(gmId);
  });

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
      group: scene.group,
      indexCards: scene.indexCards,
      notes: scene.notes,
      lastUpdated: scene.lastUpdated,
      version: scene.version,
    };

    return !isEqual(sceneToLoad, currentScene);
  }, [scene, sceneToLoad]);

  useEffect(() => {
    if (sceneToLoad) {
      setScene(
        produce((draft: IScene) => {
          draft.id = sceneToLoad.id;
          draft.name = sceneToLoad.name;
          draft.group = sceneToLoad.group;
          draft.indexCards = sceneToLoad.indexCards;
          draft.notes = sceneToLoad.notes;
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

  const playersWithCharacterSheets = scene.players.filter(
    (player) => !!player.character
  );
  const sortedPlayersWithCharacterSheets = arraySort(
    playersWithCharacterSheets,
    [
      (p) => {
        return { value: p.id === userId, direction: "asc" };
      },
    ]
  );
  const hasPlayersWithCharacterSheets = !!sortedPlayersWithCharacterSheets.length;

  const userCharacterSheet = scene.players.find((p) => {
    return p.id === userId;
  });

  useEffect(() => {
    scene.players.forEach((p) => {
      charactersManager.actions.updateIfExists(p.character);
    });
  }, [scene]);

  function safeSetScene(newScene: IScene) {
    if (newScene) {
      setScene(newScene);
    }
  }

  function loadScene(newScene: ISavableScene, keepPinned: boolean) {
    if (newScene) {
      const pinnedIndexCards = getPinnedIndexCards(scene);
      const indexCards = keepPinned
        ? [...pinnedIndexCards, ...newScene.indexCards]
        : newScene.indexCards;

      setSceneToLoad({
        id: newScene.id,
        name: newScene.name,
        group: newScene.group,
        indexCards: indexCards,
        notes: newScene.notes,
        lastUpdated: newScene.lastUpdated,
        version: newScene.version,
      });
    }
  }

  function cloneAndLoadNewScene(newScene: ISavableScene) {
    if (newScene) {
      const clonedNewScene = produce(newScene, (draft) => {
        draft.id = Id.generate();
      });
      loadScene(clonedNewScene, true);
      forceDirty();
    }
  }

  function forceDirty() {
    setTimeout(() => {
      setScene(
        produce((draft: IScene) => {
          draft.lastUpdated = getUnix();
        })
      );
    });
  }

  function resetScene() {
    setScene(
      produce((draft: IScene) => {
        const pinnedIndexCards = getPinnedIndexCards(draft);
        const everyone = [draft.gm, ...draft.players];
        draft.name = defaultSceneName;
        draft.id = Id.generate();
        draft.indexCards = pinnedIndexCards;
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

  function setGroup(newGroup: string | null | undefined) {
    setScene(
      produce((draft: IScene) => {
        draft.group = newGroup as string | undefined;
      })
    );
  }

  function addAspect(type: AspectType, isPrivate: boolean) {
    const id = Id.generate();
    setScene(
      produce((draft: IScene) => {
        draft.indexCards.push({
          id: id,
          ...defaultAspects[type],
          isPrivate: isPrivate,
        });
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
    return id;
  }

  function removeAspect(aspectId: string) {
    setScene(
      produce((draft: IScene) => {
        delete draft.aspects[aspectId];
      })
    );
  }

  function moveAspects(dragIndex: number, hoverIndex: number) {
    setScene(
      produce((draft: IScene) => {
        if (!draft) {
          return;
        }

        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }
        const hoverKey = Object.keys(draft.aspects)[hoverIndex];
        const dragKey = Object.keys(draft.aspects)[dragIndex];

        draft.aspects = Object.keys(draft.aspects).reduce<
          Record<string, IAspectV1>
        >((acc, currentAspectId, index) => {
          if (index === dragIndex) {
            return { ...acc };
          }
          if (index === hoverIndex) {
            const movedAspects =
              hoverIndex > dragIndex
                ? {
                    [hoverKey]: draft.aspects[hoverKey],
                    [dragKey]: draft.aspects[dragKey],
                  }
                : {
                    [dragKey]: draft.aspects[dragKey],
                    [hoverKey]: draft.aspects[hoverKey],
                  };
            return {
              ...acc,
              ...movedAspects,
            };
          }
          return {
            ...acc,
            [currentAspectId]: draft.aspects[currentAspectId],
          };
        }, {});
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

  function setAspectIsPrivate(aspectId: string, isPrivate: boolean) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].isPrivate = isPrivate;
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

  function toggleAspectPinned(aspectId: string) {
    setScene(
      produce((draft: IScene) => {
        draft.aspects[aspectId].pinned = !draft.aspects[aspectId].pinned;
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

  function updatePlayersWithConnections(
    connections: Array<Peer.DataConnection>
  ) {
    setScene(
      produce((draft: IScene) => {
        const offlinePlayers = draft.players.filter((p) => p.offline);

        const mappedConnections = connections.map<IPlayer>((c) => {
          const meta: IPeerMeta = c.metadata;
          const playerName = meta.playerName;
          const peerJsId = c.label;

          const playerMatch = draft.players.find((p) => p.id === peerJsId);
          const playerCharacter = playerMatch?.character;

          const rolls = playerMatch?.rolls ?? [];
          const playedDuringTurn = playerMatch?.playedDuringTurn ?? false;
          const points = playerMatch?.points ?? "3";

          return {
            id: c.label,
            playerName: playerName,
            character: playerCharacter,
            rolls: rolls,
            isGM: false,
            points: points,
            playedDuringTurn: playedDuringTurn,
            offline: false,
          };
        });
        const allPlayers = [...mappedConnections, ...offlinePlayers];
        const allPlayersMinusRemovedPlayersFromStaleConnections = allPlayers.filter(
          (p) => {
            return removedPlayers.find((id) => id === p.id) === undefined;
          }
        );

        draft.players = allPlayersMinusRemovedPlayersFromStaleConnections;
      })
    );
  }

  function addOfflinePlayer() {
    const id = Id.generate();
    setScene(
      produce((draft: IScene) => {
        draft.players.push({
          id: id,
          playerName: "",
          character: undefined,
          rolls: [],
          playedDuringTurn: false,
          offline: true,
          isGM: false,
          points: "3",
        });
      })
    );
    return id;
  }

  function removePlayer(id: string) {
    setRemovedPlayers(
      produce((draft: Array<string>) => {
        draft.push(id);
      })
    );
    setScene(
      produce((draft: IScene) => {
        draft.players = draft.players.filter((p) => {
          return p.id !== id;
        });
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

  function updatePlayerCharacter(
    id: string,
    character: ICharacter,
    loadCharacterHiddenFieldsInPlayer = false
  ) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];

        everyone.forEach((p) => {
          if (p.id === id) {
            p.character = character;
            if (loadCharacterHiddenFieldsInPlayer) {
              p.playedDuringTurn = character.playedDuringTurn ?? false;
            }
          }
        });
      })
    );
  }

  function loadPlayerCharacter(id: string, character: ICharacter) {
    updatePlayerCharacter(id, character, true);
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
              p.character.lastUpdated = getUnix();
            }
          }
        });
      })
    );
  }

  function updatePlayerCharacterMainPointCounter(
    id: string,
    points: string,
    maxPoints: string | undefined
  ) {
    setScene(
      produce((draft: IScene) => {
        const everyone = [draft.gm, ...draft.players];
        everyone.forEach((p) => {
          if (p.id === id) {
            p.points = points;
            if (p.character) {
              for (const page of p.character.pages) {
                for (const section of page.sections) {
                  for (const block of section.blocks) {
                    const shouldUpdateBlock =
                      block.type === BlockType.PointCounter &&
                      block.meta.isMainPointCounter;
                    if (shouldUpdateBlock) {
                      const typedBlock = block as IPointCounterBlock & IBlock;

                      typedBlock.value = points;
                      typedBlock.meta.max = maxPoints;
                      p.character.lastUpdated = getUnix();
                    }
                  }
                }
              }
            }
          }
        });
      })
    );
  }

  function updateGmRoll(roll: IDiceRollResult) {
    setScene(
      produce((draft: IScene) => {
        draft.gm.rolls = [roll, ...draft.gm.rolls];
      })
    );
  }

  function updatePlayerRoll(id: string | undefined, roll: IDiceRollResult) {
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

  function setNotes(notes: string) {
    setScene(
      produce((draft: IScene) => {
        draft.notes = notes;
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
    computed: {
      playersWithCharacterSheets: sortedPlayersWithCharacterSheets,
      hasPlayersWithCharacterSheets,
      userCharacterSheet,
    },
    state: {
      scene,
      dirty,
    },
    actions: {
      resetScene,
      safeSetScene,
      loadScene,
      cloneAndLoadNewScene,
      updateName,
      setGroup,
      addAspect,
      moveAspects,
      removeAspect,
      resetAspect,
      setAspectIsPrivate,
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
      updatePlayersWithConnections,
      addOfflinePlayer,
      removePlayer,
      updatePlayerCharacterMainPointCounter,
      updatePlayerPlayedDuringTurn,
      resetInitiative,
      updateGmRoll,
      updatePlayerRoll,
      fireGoodConfetti,
      fireBadConfetti,
      toggleSort,
      updatePlayerCharacter,
      loadPlayerCharacter: loadPlayerCharacter,
      updateDrawAreaObjects,
      toggleAspectPinned,
      setNotes,
    },
    _: {
      removedPlayers,
    },
  };
}

function getPinnedIndexCards(scene: IScene) {
  return scene.indexCards.filter((i) => i.pinned);
}

export function sanitizeSceneName(sceneName: string) {
  return sceneName === defaultSceneName
    ? ""
    : previewContentEditable({ value: sceneName });
}

export interface IPeerMeta {
  playerName?: string;
}
