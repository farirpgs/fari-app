import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { arraySort } from "../../../domains/array/arraySort";

export enum CharacterType {
  CoreCondensed,
  Accelerated,
  Custom,
}
export function useCharacters() {
  const key = "fari-characters";
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter>(
    undefined
  );

  const sortedCharacters = arraySort(characters, [
    (c) => ({ value: c.lastUpdated, direction: "desc" }),
  ]);

  useEffect(() => {
    // load from local storage
    try {
      const localStorageCharacters = localStorage.getItem(key);
      if (localStorageCharacters) {
        const parsed = JSON.parse(localStorageCharacters);
        setCharacters(parsed);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // sync local storage
    if (characters.length > 0) {
      try {
        const serialized = JSON.stringify(characters);
        localStorage.setItem(key, serialized);
      } catch (error) {
        console.error(error);
      }
    }
  }, [characters]);

  function add(type: CharacterType) {
    const defaultCharacter = defaultCharactersByType[type];
    const newCharacter = {
      ...defaultCharacter,
      id: uuidV4(),
      lastUpdated: new Date().getTime(),
    } as ICharacter;
    setCharacters((draft: Array<ICharacter>) => {
      return [newCharacter, ...draft];
    });
    setSelectedCharacter(newCharacter);
  }

  function update(character: ICharacter) {
    if (!character) {
      return;
    }
    setCharacters((draft: Array<ICharacter>) => {
      return draft.map((c) => {
        if (c.id === character.id) {
          return {
            ...character,
            lastUpdated: new Date().getTime(),
          };
        }
        return c;
      });
    });
  }

  function remove(id: string) {
    setCharacters((draft: Array<ICharacter>) => {
      return draft.filter((c) => c.id !== id);
    });
  }

  function select(character: ICharacter) {
    setSelectedCharacter(character);
  }

  function close() {
    setSelectedCharacter(undefined);
  }

  return {
    state: {
      characters: sortedCharacters,
      selectedCharacter,
    },
    actions: {
      add,
      update,
      remove,
      select,
      close,
    },
  };
}

const defaultCondensedCharacter: ICharacter = {
  id: undefined,
  name: "",
  aspects: [
    { name: "High Concept", value: "" },
    { name: "Trouble", value: "" },
    { name: "Relationship", value: "" },
    { name: "Other Aspect", value: "" },
    { name: "Other Aspect", value: "" },
  ],
  stunts: [
    { name: "Stunt #1", value: "" },
    { name: "Stunt #2", value: "" },
    { name: "Stunt #3", value: "" },
  ],
  skills: [
    { name: "Academics", value: "" },
    { name: "Athelics", value: "" },
    { name: "Burglary", value: "" },
    { name: "Contacts", value: "" },
    { name: "Crafts", value: "" },
    { name: "Deceive", value: "" },
    { name: "Drive", value: "" },
    { name: "Empathy", value: "" },
    { name: "Fight", value: "" },
    { name: "Investigate", value: "" },
    { name: "Lore", value: "" },
    { name: "Notice", value: "" },
    { name: "Physique", value: "" },
    { name: "Provoke", value: "" },
    { name: "Rapport", value: "" },
    { name: "Resources", value: "" },
    { name: "Shoot", value: "" },
    { name: "Stealth", value: "" },
    { name: "Will", value: "" },
  ],
  stressTracks: [
    { name: "Physical", value: [false, false, false] },
    { name: "Mental", value: [false, false, false] },
  ],
  consequences: [
    { name: "Mild", value: "" },
    { name: "Moderate", value: "" },
    { name: "Severe", value: "" },
  ],
  version: 1,
};

const defaultAcceleratedCharacter: ICharacter = {
  id: undefined,
  name: "",
  aspects: [
    { name: "High Concept", value: "" },
    { name: "Trouble", value: "" },
    { name: "Relationship", value: "" },
    { name: "Other Aspect", value: "" },
    { name: "Other Aspect", value: "" },
  ],
  stunts: [
    { name: "Stunt #1", value: "" },
    { name: "Stunt #2", value: "" },
    { name: "Stunt #3", value: "" },
  ],
  skills: [
    { name: "Careful", value: "" },
    { name: "Clever", value: "" },
    { name: "Forceful", value: "" },
    { name: "Flashy", value: "" },
    { name: "Quick", value: "" },
    { name: "Sneaky", value: "" },
  ],
  stressTracks: [{ name: "Stress", value: [false, false, false] }],
  consequences: [
    { name: "Mild", value: "" },
    { name: "Moderate", value: "" },
    { name: "Severe", value: "" },
  ],
  version: 1,
};

const defaultCustomCharacter: ICharacter = {
  id: undefined,
  name: "",
  aspects: [{ name: "Aspect", value: "" }],
  stunts: [{ name: "Stunt", value: "" }],
  skills: [{ name: "Skill", value: "" }],
  stressTracks: [{ name: "Stress", value: [false] }],
  consequences: [{ name: "Consequence", value: "" }],
  version: 1,
};

const defaultCharactersByType = {
  [CharacterType.CoreCondensed]: defaultCondensedCharacter,
  [CharacterType.Accelerated]: defaultAcceleratedCharacter,
  [CharacterType.Custom]: defaultCustomCharacter,
} as const;

export interface ICharacter {
  id: string;
  name: string;
  aspects: ICharacterCustomField<string>;
  skills: ICharacterCustomField<string>;
  stunts: ICharacterCustomField<string>;
  stressTracks: ICharacterCustomField<Array<boolean>>;
  consequences: ICharacterCustomField<string>;
  version: number;
  lastUpdated?: number;
}

export type ICharacterCustomField<T> = Array<{ name: string; value: T }>;
