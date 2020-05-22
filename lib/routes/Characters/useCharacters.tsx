import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { ICharacter } from "../Play/useScene/IScene";
// approachCareful?: string;
// approachClever?: string;
// approachForceful?: string;
// approachFlashy?: string;
// approachQuick?: string;
// approachSneaky?: string;
// skillSuperb?: string;
// skillGreat?: string;
// skillGood?: string;
// skillFair?: string;
// skillAverage?: string;

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

  function add() {
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

const defaultCharacter: ICharacter = {
  id: undefined,
  name: "Character Name...",
  highConcept: "",
  trouble: "",
  otherAspects: "",
  stunts: "",
  physicalStress: [],
  mentalStress: [],
  consequences: [],
  version: 1,
};
