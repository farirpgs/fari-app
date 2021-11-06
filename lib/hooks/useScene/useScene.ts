import produce from "immer";
import isEqual from "lodash/isEqual";
import { useContext, useEffect, useMemo, useState } from "react";
import { useCharacters } from "../../contexts/CharactersContext/CharactersContext";
import { ScenesContext } from "../../contexts/SceneContext/ScenesContext";
import { SceneFactory } from "../../domains/scene/SceneFactory";
import { IIndexCard, IIndexCardType, IScene } from "./IScene";

export type IProps = {
  userId: string;
  charactersManager: ReturnType<typeof useCharacters>;
};

export function useScene() {
  const scenesManager = useContext(ScenesContext);
  const [scene, setScene] = useState<IScene | undefined>();

  const [sceneToLoad, setSceneToLoad] = useState<IScene | undefined>(undefined);

  const dirty = useMemo(() => {
    if (!sceneToLoad) {
      return false;
    }

    return !isEqual(sceneToLoad, scene);
  }, [scene, sceneToLoad]);

  useEffect(() => {
    if (sceneToLoad) {
      setScene(sceneToLoad);
    }
  }, [sceneToLoad]);

  function addAndSetNewScene() {
    if (!scene) {
      const sceneToInsert = SceneFactory.make();
      const newScene = scenesManager.actions.upsert(sceneToInsert);
      setSceneToLoad(newScene);
    } else {
      const sceneToInsert = SceneFactory.make();
      sceneToInsert.name = "";
      sceneToInsert.group = scene.group;

      const newScene = scenesManager.actions.upsert(sceneToInsert);
      setSceneToLoad(newScene);
    }
  }

  function overrideScene(newScene: IScene) {
    if (newScene) {
      setScene(newScene);
    }
  }

  function loadScene(newScene: IScene) {
    if (newScene) {
      setSceneToLoad({
        id: newScene.id,
        name: newScene.name,
        group: newScene.group,
        indexCards: newScene.indexCards,
        notes: newScene.notes,
        lastUpdated: newScene.lastUpdated,
        version: newScene.version,
      });
    }
  }

  function cloneAndLoadNewScene(sceneToClone: IScene) {
    if (sceneToClone) {
      const clonedNewScene = scenesManager.actions.duplicate(sceneToClone.id);
      loadScene(clonedNewScene as IScene);
    }
  }

  function updateName(name: string) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.name = name;
      })
    );
  }

  function setGroup(newGroup: string | null | undefined) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }
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
      produce((draft) => {
        if (!draft) {
          return;
        }
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
      produce((draft) => {
        if (!draft) {
          return;
        }
        const cards = draft.indexCards[type];
        const index = cards.findIndex((c) => c.id === indexCardId);
        cards.splice(index, 1);
      })
    );
  }

  function duplicateIndexCard(indexCard: IIndexCard, type: IIndexCardType) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }
        const cards = draft.indexCards[type];
        const copy = SceneFactory.duplicateIndexCard(indexCard);
        const index = cards.findIndex((c) => c.id === indexCard.id);
        if (index !== -1) {
          cards.splice(index, 0, copy);
        } else {
          cards.unshift(copy);
        }
      })
    );
  }

  function updateIndexCard(updatedIndexCard: IIndexCard, type: IIndexCardType) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }
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
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.indexCards[from] = draft.indexCards[from].filter(
          (i) => i.id !== indexCardToMove.id
        );

        const to: IIndexCardType = from === "public" ? "private" : "public";
        draft.indexCards[to].unshift(indexCardToMove);
      })
    );
  }

  function moveIndexCardTo(
    idOfIndexCardToMove: string,
    idOfIndexCardToMoveTo: string,
    type: IIndexCardType
  ) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }

        const indexCards = draft.indexCards[type];
        const indexCardToMove = removeIndexCardFromCurrentPosition();
        addIndexCardToNewPosition(indexCardToMove);

        function removeIndexCardFromCurrentPosition() {
          for (const [index, card] of indexCards.entries()) {
            if (card.id === idOfIndexCardToMove) {
              return indexCards.splice(index, 1)[0];
            }
            for (const [subCardIndex, subCard] of card.subCards.entries()) {
              if (subCard.id === idOfIndexCardToMove) {
                return card.subCards.splice(subCardIndex, 1)[0];
              }
            }
          }
        }

        function addIndexCardToNewPosition(cardToAdd: IIndexCard | undefined) {
          if (!cardToAdd) {
            return;
          }

          for (const card of indexCards) {
            if (card.id === idOfIndexCardToMoveTo) {
              card.subCards.push(cardToAdd);
              return;
            }
          }
        }
      })
    );
  }
  function moveIndexCard(
    dragIndex: number,
    hoverIndex: number,
    type: IIndexCardType
  ) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }
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

  function resetInitiative() {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }

        draft.indexCards.public.forEach((indexCard) => {
          indexCard.playedDuringTurn = false;
          indexCard.subCards.forEach((subCard) => {
            subCard.playedDuringTurn = false;
          });
        });
        draft.indexCards.private.forEach((indexCard) => {
          indexCard.playedDuringTurn = false;
          indexCard.subCards.forEach((subCard) => {
            subCard.playedDuringTurn = false;
          });
        });
      })
    );
  }

  function setNotes(notes: string) {
    setScene(
      produce((draft) => {
        if (!draft) {
          return;
        }
        draft.notes = notes;
      })
    );
  }

  return {
    state: {
      scene,
      dirty,
    },
    actions: {
      addIndexCard: addIndexCard,
      cloneAndLoadNewScene,
      addAndSetNewScene,
      loadScene,
      toggleIndexCardSection,
      moveIndexCard,
      moveIndexCardTo,
      removeIndexCard,
      duplicateIndexCard,
      resetInitiative,
      overrideScene: overrideScene,
      setGroup,
      setNotes,
      updateIndexCard,
      updateName,
    },
  };
}

export interface IPeerMeta {
  playerName?: string;
}
