import produce from "immer";
import { useContext } from "react";
import { SettingsContext } from "../../../contexts/SettingsContext/SettingsContext";
import { CharacterFactory } from "../../../domains/character/CharacterFactory";
import { BlockType, IBlock } from "../../../domains/character/types";
import { SceneFactory } from "../../../domains/scene/SceneFactory";
import { useLazyState } from "../../../hooks/useLazyState/useLazyState";
import { IIndexCard } from "../../../hooks/useScene/IScene";

export function useIndexCard(props: {
  indexCard: IIndexCard;
  onChange(indexCard: IIndexCard): void;
}) {
  const settingsManager = useContext(SettingsContext);

  const [indexCard, setIndexCard] = useLazyState({
    value: props.indexCard,
    onChange: (newIndexCard) => {
      props.onChange(newIndexCard);
    },
    delay: 0,
  });

  function setColor(newColor: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.color = newColor;
      })
    );
  }

  function togglePinned() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.pinned = !draft.pinned;
      })
    );
  }

  function setTitle(newTitle: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.title = newTitle;
      })
    );
  }
  function setTitleLabel(newLabel: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.titleLabel = newLabel;
      })
    );
  }

  function setContentLabel(newLabel: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.contentLabel = newLabel;
      })
    );
  }

  function setContent(newContent: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.content = newContent;
      })
    );
  }

  function toggleInitiative() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.playedDuringTurn = !draft.playedDuringTurn;
      })
    );
  }

  function reset() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        const oldId = draft.id;
        const oldSub = draft.sub;
        const newIndexCard: IIndexCard = {
          ...SceneFactory.makeIndexCard(),
          id: oldId,
          sub: oldSub,
        };
        return newIndexCard;
      })
    );
  }

  function setBlock(newBlock: IBlock) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.blocks = draft.blocks.map((block) => {
          if (block.id === newBlock.id) {
            return newBlock;
          }
          return block;
        });
      })
    );
  }

  function addBlock(blockType: BlockType) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.blocks.push(
          CharacterFactory.makeBlock(blockType, {
            defaultCommands: settingsManager.state.diceCommandIds,
          })
        );
      })
    );
  }

  function addSubCard() {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.subCards.push(SceneFactory.makeSubIndexCard());
      })
    );
  }

  function duplicateBlock(blockToDuplicate: IBlock) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        const duplicatedBlock =
          CharacterFactory.duplicateBlock(blockToDuplicate);
        const index = draft.blocks.findIndex(
          (block) => block.id === blockToDuplicate.id
        );
        draft.blocks.push();
        draft.blocks.splice(index + 1, 0, duplicatedBlock);
      })
    );
  }

  function removeBlock(blockToRemove: IBlock) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.blocks = draft.blocks.filter((block) => {
          return block.id !== blockToRemove.id;
        });
      })
    );
  }

  function removeIndexCard(indexCardId: string) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.subCards = draft.subCards.filter(
          (indexCard) => indexCard.id !== indexCardId
        );
      })
    );
  }

  function duplicateIndexCard(indexCard: IIndexCard) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        const indexOf = draft.subCards.findIndex((i) => i.id === indexCard.id);
        const copy = SceneFactory.duplicateIndexCard(indexCard);
        draft.subCards.splice(indexOf, 0, copy);
      })
    );
  }

  function updateIndexCard(newIndexCard: IIndexCard) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        draft.subCards = draft.subCards.map((indexCard) => {
          if (indexCard.id === newIndexCard.id) {
            return newIndexCard;
          }
          return indexCard;
        });
      })
    );
  }

  function moveIndexCard(dragIndex: number, hoverIndex: number) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }

        const dragItem = draft.subCards[dragIndex];
        draft.subCards.splice(dragIndex, 1);
        draft.subCards.splice(hoverIndex, 0, dragItem);
      })
    );
  }

  function moveIndexCardBlock(dragIndex: number, hoverIndex: number) {
    setIndexCard(
      produce((draft: IIndexCard) => {
        if (dragIndex === undefined || hoverIndex === undefined) {
          return;
        }

        const dragItem = draft.blocks[dragIndex];
        draft.blocks.splice(dragIndex, 1);
        draft.blocks.splice(hoverIndex, 0, dragItem);
      })
    );
  }

  return {
    state: { indexCard },
    actions: {
      addBlock,
      addSubCard,
      duplicateBlock,
      removeBlock,
      removeIndexCard,
      reset,
      setBlock,
      setColor,
      setContent,
      setTitleLabel: setTitleLabel,
      setContentLabel,
      setTitle,
      toggleInitiative,
      togglePinned,
      duplicateIndexCard,
      moveIndexCard,
      moveIndexCardBlock,
      updateIndexCard,
    },
  };
}
