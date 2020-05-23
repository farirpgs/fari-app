import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

export enum CharacterType {
  CoreCondensed,
  Accelerated,
}
export function useCharacters() {
  const key = "fari-characters";
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter>(
    undefined
  );

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
    try {
      const serialized = JSON.stringify(characters);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(error);
    }
  }, [characters]);

  function add(type: CharacterType) {
    const defaultCharacter =
      type === CharacterType.CoreCondensed
        ? defaultCondensedCharacter
        : defaultAcceleratedCharacter;
    const newCharacter = {
      ...defaultCharacter,
      id: uuidV4(),
    };
    setCharacters((draft: Array<ICharacter>) => {
      return [newCharacter, ...draft];
    });
    setSelectedCharacter(newCharacter);
  }

  function update(character: ICharacter) {
    setCharacters((draft: Array<ICharacter>) => {
      return draft.map((c) => {
        if (c.id === character.id) {
          return character;
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
      characters,
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
  name: "Character Name...",
  aspects: {
    "High Concept": "",
    "Trouble": "",
    "Relationship": "",
    "Other Aspect #1": "",
    "Other Aspect #2": "",
  },
  stunts: "<br/><br/><br/><br/>",
  skills: {
    Academics: "",
    Athelics: "",
    Burglary: "",
    Contacts: "",
    Crafts: "",
    Deceive: "",
    Drive: "",
    Empathy: "",
    Fight: "",
    Investigate: "",
    Lore: "",
    Notice: "",
    Physique: "",
    Provoke: "",
    Rapport: "",
    Resources: "",
    Shoot: "",
    Stealth: "",
    Will: "",
  },
  stress: {
    Physical: [false, false, false],
    Mental: [false, false, false],
  },
  consequences: {
    Mild: "",
    Moderate: "",
    Severe: "",
  },
  version: 1,
};

const defaultAcceleratedCharacter: ICharacter = {
  id: undefined,
  name: "Character Name...",
  aspects: {
    "High Concept": "",
    "Trouble": "",
    "Relationship": "",
    "Other Aspect #1": "",
    "Other Aspect #2": "",
  },
  stunts: "<br/><br/><br/><br/>",
  skills: {
    Careful: "",
    Clever: "",
    Forceful: "",
    Flashy: "",
    Quick: "",
    Sneaky: "",
  },
  stress: {
    Stress: [],
  },
  consequences: {
    Mild: "",
    Moderate: "",
    Severe: "",
  },
  version: 1,
};

export interface ICharacter {
  id: string;
  name: string;
  aspects: Record<string, string>;
  skills: Record<string, string>;
  stunts: string;
  stress: Record<string, Array<boolean>>;
  consequences: Record<string, string>;
  version: number;
}
