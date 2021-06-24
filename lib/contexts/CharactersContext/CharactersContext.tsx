import React from "react";
import { CharacterFactory } from "../../domains/character/CharacterFactory";
import { CharacterTemplates } from "../../domains/character/CharacterType";
import { ICharacter } from "../../domains/character/types";
import { getUnix, getUnixFrom } from "../../domains/dayjs/getDayJS";
import { FariEntity } from "../../domains/fari-entity/FariEntity";
import { Id } from "../../domains/Id/Id";
import { useGroups } from "../../hooks/useGroups/useGroups";
import { useStorageEntities } from "../../hooks/useStorageEntities/useStorageEntities";

export const CharactersContext = React.createContext<
  ReturnType<typeof useCharacters>
>(undefined as any);

export function useCharacters(props?: { localStorage: Storage }) {
  const localStorage = props?.localStorage ?? window.localStorage;
  const key = "fari-characters";

  const [characters, setCharacters] = useStorageEntities({
    key: key,
    localStorage: localStorage,
    migrationFunction: CharacterFactory.migrate,
  });

  const groups = useGroups(characters, (c) => c.group);

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

    const id = character.id || Id.generate(); // If it's a template, `id` is undefined
    const characterToUpsert = {
      ...character,
      id: id,
      lastUpdated: getUnix(),
    };
    setCharacters((prev: Array<ICharacter>) => {
      const exists = prev.some((c) => c.id === character.id);
      if (!exists) {
        return [characterToUpsert, ...prev];
      } else {
        return prev.map((c) => {
          if (c.id === character.id) {
            return characterToUpsert;
          }
          return c;
        });
      }
    });

    return characterToUpsert;
  }

  function addIfDoesntExist(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    setCharacters((prev: Array<ICharacter>) => {
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

    setCharacters((prev: Array<ICharacter>) => {
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
    const match = characters.find((s) => s.id === id);
    if (!match) {
      return;
    }

    const newCharacter = CharacterFactory.duplicate(match);
    setCharacters((draft: Array<ICharacter>) => {
      return [...draft, newCharacter];
    });
    return newCharacter;
  }

  function isInStorage(id: string | undefined) {
    return characters.some((c) => c.id === id);
  }

  async function importEntity(characterFile: FileList | null) {
    const characterToImport = await FariEntity.import<ICharacter>({
      filesToImport: characterFile,
      fariType: "character",
    });
    const migratedCharacter = CharacterFactory.migrate(characterToImport);
    const match = characters.find((c) => c.id === migratedCharacter.id);
    return { character: migratedCharacter, exists: !!match };
  }

  function exportEntity(character: ICharacter) {
    FariEntity.export({
      element: character,
      fariType: "character",
      name: character.name,
    });
  }

  function exportEntityAsTemplate(character: ICharacter) {
    const template = CharacterFactory.makeATemplate(character);
    FariEntity.export({
      element: template,
      fariType: "character",
      name: template.name,
    });
  }

  return {
    state: {
      characters: characters,
      groups: groups,
    },
    actions: {
      add,
      upsert,
      addIfDoesntExist,
      updateIfMoreRecent,
      remove,
      duplicate,
      importEntity,
      exportEntity,
      exportEntityAsTemplate,
    },
    selectors: {
      isInStorage,
    },
  };
}
