import React, { useEffect, useMemo, useRef, useState } from "react";
import { ManagerMode } from "../../components/Manager/Manager";
import { arraySort } from "../../domains/array/arraySort";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { CharacterTemplates } from "../../domains/character/CharacterType";
import { ICharacter } from "../../domains/character/types";
import { getUnixFrom } from "../../domains/dayjs/getDayJS";
import { useGroups } from "../../hooks/useGroups/useGroups";

type IManagerCallback = (character: ICharacter) => void;

export const CharactersContext = React.createContext<
  ReturnType<typeof useCharacters>
>(undefined as any);

export function useCharacters(props?: { localStorage: Storage }) {
  const localStorage = props?.localStorage ?? window.localStorage;
  const key = "fari-characters";

  const [mode, setMode] = useState(ManagerMode.Close);
  const managerCallback = useRef<IManagerCallback | undefined>(undefined);
  const [characters, setCharacters] = useState<Array<ICharacter>>(() => {
    // load from local storage
    try {
      const localStorageCharacters = localStorage.getItem(key);

      if (localStorageCharacters) {
        const parsed = JSON.parse(localStorageCharacters) as Array<any>;
        const migrated = parsed.map(CharacterFactory.migrate);
        return migrated;
      }
    } catch (error) {
      if (!process.env.IS_JEST) {
        console.error(error);
      }
    }
    return [];
  });

  const sortedCharacters = useMemo(() => {
    return arraySort(characters, [
      (c) => {
        const lastUpdate = getUnixFrom(c.lastUpdated);
        return { value: lastUpdate, direction: "desc" };
      },
    ]);
  }, [characters]);

  const groups = useGroups(sortedCharacters, (c) => c.group);

  useEffect(() => {
    // sync local storage
    try {
      const serialized = JSON.stringify(characters);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(error);
    }
  }, [characters]);

  function openManager(newMode: ManagerMode, callback?: IManagerCallback) {
    setMode(newMode);
    managerCallback.current = callback;
  }

  function closeManager() {
    setMode(ManagerMode.Close);
    managerCallback.current = undefined;
  }

  async function add(type: CharacterTemplates): Promise<ICharacter> {
    const newCharacter = await CharacterFactory.make(type);

    setCharacters((draft: Array<ICharacter>) => {
      return [newCharacter, ...draft];
    });
    return newCharacter;
  }

  function upsert(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    setCharacters((prev: Array<ICharacter>) => {
      const exists = prev.some((c) => c.id === character.id);

      if (!exists) {
        return [character, ...prev];
      } else {
        return prev.map((c) => {
          if (c.id === character.id) {
            return character;
          }
          return c;
        });
      }
    });

    return character;
  }

  function addOrUpdateIfMoreRecent(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    setCharacters((prev: Array<ICharacter>) => {
      const exists = prev.some((c) => c.id === character.id);

      if (!exists) {
        return [character, ...prev];
      }

      return prev.map((c) => {
        const currentCharacterLastUpdated = getUnixFrom(c.lastUpdated);
        const characterLastUpdate = getUnixFrom(character?.lastUpdated ?? 0);

        const shouldUpdate = characterLastUpdate >= currentCharacterLastUpdated;
        if (c.id === character.id && shouldUpdate) {
          return character;
        }
        return c;
      });
    });
  }

  function remove(id: string | undefined) {
    setCharacters((draft: Array<ICharacter>) => {
      return draft.filter((c) => c.id !== id);
    });
  }

  function duplicate(id: string | undefined) {
    setCharacters((draft: Array<ICharacter>) => {
      const match = draft.find((s) => s.id === id);

      if (match) {
        return [...draft, CharacterFactory.duplicate(match)];
      }
      return draft;
    });
  }

  function isInStorage(id: string | undefined) {
    return characters.some((c) => c.id === id);
  }

  return {
    state: {
      mode,
      characters: sortedCharacters,
      managerCallback: managerCallback.current,
      groups: groups,
    },
    actions: {
      openManager,
      closeManager,
      add,
      upsert,
      addOrUpdateIfMoreRecent,
      remove,
      duplicate,
    },
    selectors: {
      isInStorage,
    },
  };
}
