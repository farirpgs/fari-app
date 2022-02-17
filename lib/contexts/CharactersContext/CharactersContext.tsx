import React from "react";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { ICharacterTemplate } from "../../domains/character/CharacterType";
import { ICharacter } from "../../domains/character/types";
import { getUnixFrom } from "../../domains/dayjs/getDayJS";
import { useAppEntity } from "../../hooks/useAppEntity/useAppEntity";

export const CharactersContext = React.createContext<
  ReturnType<typeof useCharacters>
>(undefined as any);

export function useCharacters(props?: { localStorage: Storage }) {
  const entityManager = useAppEntity({
    fariType: "character",
    localStorageKey: "fari-characters",
    localStorage: props?.localStorage,
    onDuplicate: CharacterFactory.duplicate,
    onMakeTemplate: CharacterFactory.makeATemplate,
    onMigration: CharacterFactory.migrate,
  });

  async function add(type: ICharacterTemplate): Promise<ICharacter> {
    const newCharacter = await CharacterFactory.make(type);

    entityManager.actions.setEntities((draft: Array<ICharacter>) => {
      return [newCharacter, ...draft];
    });
    return newCharacter;
  }

  function addIfDoesntExist(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    entityManager.actions.setEntities((prev: Array<ICharacter>) => {
      const exists = prev.some((c) => c.id === character.id);

      if (!exists) {
        return [character, ...prev];
      }
      return prev;
    });
  }

  function updateIfMoreRecent(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    entityManager.actions.setEntities((prev: Array<ICharacter>) => {
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

  function isInStorage(id: string | undefined) {
    return entityManager.state.entities.some((c) => c.id === id);
  }

  return {
    state: {
      characters: entityManager.state.entities,
      groups: entityManager.state.groups,
    },
    actions: {
      ...entityManager.actions,
      add,
      addIfDoesntExist,
      updateIfMoreRecent,
    },
    selectors: {
      isInStorage,
    },
  };
}
