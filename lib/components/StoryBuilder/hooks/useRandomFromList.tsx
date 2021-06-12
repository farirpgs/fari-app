import { useState } from "react";

export function useRandomFromList<T extends { label: string }>(list: Array<T>) {
  const [state, setState] = useState<T>();

  function pick() {
    const newElement = getRandomFromList(list);
    if (newElement) {
      setState(newElement);
    }
  }

  function getRandomFromList(list: Array<T>): T {
    const listWithoutCurrentElement = list.filter(
      (l) => l.label !== state?.label
    );
    const length = listWithoutCurrentElement.length;
    const index = Math.trunc(Math.random() * length);
    const newPick = listWithoutCurrentElement[index];
    return newPick;
  }

  return [state, pick] as const;
}
