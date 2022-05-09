import produce from "immer";
import { useEffect, useState } from "react";
import { IIndexCard, IIndexCardType } from "../../../hooks/useScene/IScene";

export function useHiddenIndexCardRecord(
  indexCards: Record<IIndexCardType, Array<IIndexCard>> | undefined
) {
  const [indexCardHiddenRecord, setIndexCardHiddenRecord] = useState<
    Record<string, boolean>
  >({});

  const areAllCardsVisible =
    Object.keys(indexCardHiddenRecord).length === 0
      ? true
      : Object.values(indexCardHiddenRecord).every((c) => !c);
  useEffect(
    function keepHiddenRecordsInSync() {
      if(!indexCards){
        return
      }
      setIndexCardHiddenRecord((prev: Record<string, boolean>) => {
        const newRecord: Record<string, boolean> = {};
        const indexCardsFromAllTypes = [
          ...indexCards.public,
          ...indexCards.private,
        ];
        for (const indexCard of indexCardsFromAllTypes) {
          newRecord[indexCard.id] = prev[indexCard.id] ?? false;
          for (const subCard of indexCard.subCards) {
            newRecord[subCard.id] = prev[subCard.id] ?? false;
          }
        }
        return newRecord;
      });
    },
    [indexCards]
  );

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
    if(!indexCards){
      return
    }
    setIndexCardHiddenRecord(
      produce((draft: Record<string, boolean>) => {
        const newValue = areAllCardsVisible ? true : false;
        const indexCardsFromAllTypes = [
          ...indexCards.public,
          ...indexCards.private,
        ];
        for (const indexCard of indexCardsFromAllTypes) {
          draft[indexCard.id] = newValue;
          for (const subCard of indexCard.subCards) {
            draft[subCard.id] = newValue;
          }
        }
      })
    );
  }

  return {
    state: {
      areAllCardsVisible,
      indexCardHiddenRecord,
    },
    actions: {
      toggle,
      toggleAll,
    },
  };
}
