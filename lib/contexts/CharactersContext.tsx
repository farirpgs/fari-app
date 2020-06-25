import produce from "immer";
import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { arraySort } from "../domains/array/arraySort";

export enum CharacterType {
  CoreCondensed,
  Accelerated,
  Custom,
}

export const CharactersContext = React.createContext<
  ReturnType<typeof useCharacters>
>(undefined as any);

export function useCharacters() {
  const key = "fari-characters";
  const [characters, setCharacters] = useState<Array<ICharacter>>(() => {
    // load from local storage
    try {
      const localStorageCharacters = localStorage.getItem(key);
      if (localStorageCharacters) {
        const parsed = JSON.parse(localStorageCharacters);
        const migrated = migrateCharacters(parsed);
        return migrated;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  });
  const [selectedCharacter, setSelectedCharacter] = useState<
    ICharacter | undefined
  >(undefined);

  const sortedCharacters = arraySort(characters, [
    (c) => ({ value: c.lastUpdated, direction: "desc" }),
  ]);

  useEffect(() => {
    // sync local storage
    try {
      const serialized = JSON.stringify(characters);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(error);
    }
  }, [characters]);

  function add(type: CharacterType): ICharacter {
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
    return newCharacter;
  }

  function update(character: ICharacter | undefined) {
    if (!character) {
      return;
    }
    setCharacters((draft: Array<ICharacter>) => {
      return draft.map((c) => {
        if (c.id === character.id) {
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
    { name: "Athletics", value: "" },
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
    {
      name: "Physical",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
      ],
    },
    {
      name: "Mental",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
      ],
    },
  ],
  consequences: [
    { name: "Mild", value: "" },
    { name: "Moderate", value: "" },
    { name: "Severe", value: "" },
  ],
  refresh: 3,
  version: 2,
  lastUpdated: new Date().getTime(),
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
  stressTracks: [
    {
      name: "Stress",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
      ],
    },
  ],
  consequences: [
    { name: "Mild", value: "" },
    { name: "Moderate", value: "" },
    { name: "Severe", value: "" },
  ],
  refresh: 3,
  version: 2,
  lastUpdated: new Date().getTime(),
};

const defaultCustomCharacter: ICharacter = {
  id: undefined,
  name: "",
  aspects: [{ name: "Aspect", value: "" }],
  stunts: [{ name: "Stunt", value: "" }],
  skills: [{ name: "Skill", value: "" }],
  stressTracks: [
    {
      name: "Stress",
      value: [
        { checked: false, label: "1" },
        { checked: false, label: "2" },
        { checked: false, label: "3" },
      ],
    },
  ],
  consequences: [{ name: "Consequence", value: "" }],
  refresh: 3,
  version: 2,
  lastUpdated: new Date().getTime(),
};

const defaultCharactersByType = {
  [CharacterType.CoreCondensed]: defaultCondensedCharacter,
  [CharacterType.Accelerated]: defaultAcceleratedCharacter,
  [CharacterType.Custom]: defaultCustomCharacter,
} as const;

export interface ICharacter {
  id?: string;
  name: string;
  aspects: ICharacterCustomField<string>;
  skills: ICharacterCustomField<string>;
  stunts: ICharacterCustomField<string>;
  stressTracks: ICharacterCustomField<
    Array<{ checked?: boolean; label: string }>
  >;
  consequences: ICharacterCustomField<string>;
  version: number;
  lastUpdated: number;
  refresh: number;
}

export type ICharacterCustomField<TValue> = Array<{
  name: string;
  value: TValue;
}>;

export function migrateCharacters(characters: Array<ICharacter>) {
  return produce(characters, (draft) => {
    draft.forEach((c) => {
      if (c.version === 1) {
        // stress box values used to be booleans, now they are `{ checked?: boolean; label: string }`
        c.stressTracks.forEach((s) => {
          s.value = s.value.map((box, index) => {
            return {
              checked: (box as unknown) as boolean,
              label: `${index + 1}`,
            };
          });
        });
        c.version = 2;
      }
    });
  });
}
