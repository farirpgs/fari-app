import produce from "immer";
import { useState } from "react";
import { IIndexCard, IIndexCardType } from "../../../hooks/useScene/IScene";

export function useHiddenIndexCardRecord(
  indexCards: Record<IIndexCardType, Array<IIndexCard>>
) {
  const [indexCardHiddenRecord, setIndexCardHiddenRecord] = useState<
    Record<string, boolean>
  >({});
  const areAllCardsVisible =
    Object.keys(indexCardHiddenRecord).length === 0
      ? true
      : Object.values(indexCardHiddenRecord).every((c) => !c);

  function toggle(indexCard: IIndexCard) {
    setIndexCardHiddenRecord(
      produce((draft: Record<string, boolean>) => {
        const oldValue = draft[indexCard.id];
        const newValue = !oldValue;
        draft[indexCard.id] = newValue;
        indexCard.subCards.forEach((subCard) => {
          draft[subCard.id] = newValue;
        });
      })
    );
  }

  function toggleAll() {
    setIndexCardHiddenRecord(
      produce((draft: Record<string, boolean>) => {
        const newValue = areAllCardsVisible ? true : false;
        const indexCardsFromAllTypes = [
          ...indexCards.public,
          ...indexCards.private,
        ];
        const allIndexCardIds = [];
        for (const indexCard of indexCardsFromAllTypes) {
          draft[indexCard.id] = newValue;
          for (const subCard of indexCard.subCards) {
            allIndexCardIds.push(subCard.id);
            draft[subCard.id] = newValue;
          }
        }
      })
    );
  }

  return {
    state: {
      indexCardHiddenRecord,
    },
    actions: {
      toggle,
      toggleAll,
    },
  };
}
