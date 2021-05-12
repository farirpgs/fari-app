import produce from "immer";
import isEqual from "lodash/isEqual";
import Peer from "peerjs";
import { useEffect, useMemo, useState } from "react";
import { previewContentEditable } from "../../components/ContentEditable/ContentEditable";
import { IDrawAreaObjects } from "../../components/DrawArea/hooks/useDrawing";
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
import { IIndexCard, IIndexCardType, IPlayer, IScene } from "./IScene";

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

  useEffect(
    function syncCharacterSheetForMe() {
      scene.players.forEach((player) => {
        const isMe = props.userId === player.id;

        if (isMe) {
          charactersManager.actions.addIfDoesntExist(player.character);
        }
        charactersManager.actions.updateIfMoreRecent(player.character);
      });
    },
    [props.userId, scene]
  );

  function safeSetScene(newScene: IScene) {
    if (newScene) {
      setScene(newScene);
    }
  }

  function loadScene(newScene: ISavableScene, keepPinned: boolean) {
    if (newScene) {
      const pinnedIndexCards = getPinnedIndexCards(scene);
      const publicIndexCards = keepPinned
        ? [...pinnedIndexCards.publicIndexCards, ...newScene.indexCards.public]
        : newScene.indexCards.public;
      const privateIndexCards = keepPinned
        ? [
            ...pinnedIndexCards.privateIndexCards,
            ...newScene.indexCards.private,
          ]
        : newScene.indexCards.private;

      setSceneToLoad({
        id: newScene.id,
        name: newScene.name,
        group: newScene.group,
        indexCards: {
          public: publicIndexCards,
          private: privateIndexCards,
        },
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
        const pinnedIndexCards = getPinnedIndexCards(scene);
        const everyone = [draft.gm, ...draft.players];
        draft.name = defaultSceneName;
        draft.id = Id.generate();
        draft.indexCards = {
          public: pinnedIndexCards.publicIndexCards,
          private: pinnedIndexCards.privateIndexCards,
        };
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

  function addIndexCard(
    type: IIndexCardType,
    cardProducer?: (card: IIndexCard) => IIndexCard | void
  ) {
    const defaultCard = SceneFactory.makeIndexCard();
    const newCard = cardProducer
      ? produce(defaultCard, cardProducer)
      : defaultCard;
    setScene(
      produce((draft: IScene) => {
        const cards = draft.indexCards[type];

        cards.unshift(newCard);
      })
    );
    setTimeout(() => {
      try {
        const indexCard: HTMLSpanElement | null = document.querySelector(
          `#index-card-${newCard.id}`
        );
        if (indexCard) {
          indexCard.focus();
        }
      } catch (error) {}
    });
    return newCard;
  }

  function removeIndexCard(indexCardId: string, type: IIndexCardType) {
    setScene(
      produce((draft: IScene) => {
        const cards = draft.indexCards[type];
        const index = cards.findIndex((c) => c.id === indexCardId);
        cards.splice(index, 1);
      })
    );
  }

  function duplicateIndexCard(indexCard: IIndexCard, type: IIndexCardType) {
    setScene(
      produce((draft: IScene) => {
        const cards = draft.indexCards[type];
        const index = cards.findIndex((c) => c.id === indexCard.id);
        const copy = SceneFactory.duplicateIndexCard(indexCard);
        cards.splice(index, 0, copy);
      })
    );
  }

  function updateIndexCard(updatedIndexCard: IIndexCard, type: IIndexCardType) {
    setScene(
      produce((draft: IScene) => {
        const cards = draft.indexCards[type];
        const index = cards.findIndex((c) => c.id === updatedIndexCard.id);
        cards[index] = updatedIndexCard;
      })
    );
  }

  function toggleIndexCardSection(
    indexCardToMove: IIndexCard,
    from: IIndexCardType
  ) {
    setScene(
      produce((draft: IScene) => {
        draft.indexCards[from] = draft.indexCards[from].filter(
          (i) => i.id !== indexCardToMove.id
        );

        const to: IIndexCardType = from === "public" ? "private" : "public";
        draft.indexCards[to].unshift(indexCardToMove);
      })
    );
  }

  function moveIndexCard(
    dragIndex: number,
    hoverIndex: number,
    type: IIndexCardType
  ) {
    setScene(
      produce((draft: IScene) => {
        if (!draft) {
          return;
        }

        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }

        const cards = draft.indexCards[type];

        const dragItem = cards[dragIndex];

        cards.splice(dragIndex, 1);
        cards.splice(hoverIndex, 0, dragItem);
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

        draft.indexCards.public.forEach((indexCard) => {
          indexCard.playedDuringTurn = false;
        });
        draft.indexCards.private.forEach((indexCard) => {
          indexCard.playedDuringTurn = false;
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
                const allSections = [
                  ...page.sections.left,
                  ...page.sections.right,
                ];
                for (const section of allSections) {
                  for (const block of section.blocks) {
                    const shouldUpdateBlock =
                      block.type === BlockType.PointCounter &&
                      block.meta.isMainPointCounter;
                    if (shouldUpdateBlock) {
                      const typedBlock = block as IPointCounterBlock & IBlock;
                      console.debug("shouldUpdateBlock", shouldUpdateBlock);

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
      addIndexCard: addIndexCard,
      addOfflinePlayer,
      cloneAndLoadNewScene,
      fireBadConfetti,
      fireGoodConfetti,
      loadPlayerCharacter: loadPlayerCharacter,
      loadScene,
      toggleIndexCardSection,
      moveIndexCard,
      removeIndexCard,
      duplicateIndexCard,
      removePlayer,
      resetInitiative,
      resetScene,
      safeSetScene,
      setGroup,
      setNotes,
      updateDrawAreaObjects,
      updateGmRoll,
      updateIndexCard,
      updateName,
      updatePlayerCharacter,
      updatePlayerCharacterMainPointCounter,
      updatePlayerPlayedDuringTurn,
      updatePlayerRoll,
      updatePlayersWithConnections,
    },
    _: {
      removedPlayers,
    },
  };
}

function getPinnedIndexCards(scene: IScene) {
  const publicIndexCards = scene.indexCards.public.filter((i) => i.pinned);
  const privateIndexCards = scene.indexCards.private.filter((i) => i.pinned);

  return { publicIndexCards, privateIndexCards };
}

export function sanitizeSceneName(sceneName: string) {
  return sceneName === defaultSceneName
    ? ""
    : previewContentEditable({ value: sceneName });
}

export interface IPeerMeta {
  playerName?: string;
}
