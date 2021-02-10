import produce from "immer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ManagerMode } from "../../components/Manager/Manager";
import { arraySort } from "../../domains/array/arraySort";
import {
  CharacterFactory,
  Position,
  SectionType,
} from "../../domains/character/CharacterFactory";
import { CharacterType } from "../../domains/character/CharacterType";
import { getUnixFrom } from "../../domains/dayjs/getDayJS";
import { Id } from "../../domains/id/Id";
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
        const parsed = JSON.parse(localStorageCharacters);
        const migrated = migrateCharacters(parsed);
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

  function add(type: CharacterType): ICharacter {
    const newCharacter = CharacterFactory.make(type);

    setCharacters((draft: Array<ICharacter>) => {
      return [newCharacter, ...draft];
    });
    return newCharacter;
  }

  function upsert(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    const exists = characters.find((s) => s.id === character.id);

    if (!exists) {
      setCharacters((draft: Array<ICharacter>) => {
        return [character, ...draft];
      });
    } else {
      setCharacters((draft: Array<ICharacter>) => {
        return draft.map((c) => {
          if (c.id === character.id) {
            return character;
          }
          return c;
        });
      });
    }
    return character;
  }

  function updateIfExists(character: ICharacter | undefined) {
    if (!character) {
      return;
    }

    setCharacters((draft: Array<ICharacter>) => {
      return draft.map((c) => {
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
      updateIfExists,
      remove,
    },
  };
}
export interface IV1Character {
  id: string;
  name: string;
  aspects: ICharacterCustomField<string>;
  skills: ICharacterCustomField<string>;
  stunts: ICharacterCustomField<string>;
  stressTracks: ICharacterCustomField<Array<boolean>>;
  consequences: ICharacterCustomField<string>;
  aspectsLabel: string | undefined;
  skillsLabel: string | undefined;
  stuntsLabel: string | undefined;
  stressTracksLabel: string | undefined;
  consequencesLabel: string | undefined;
  refreshLabel: string | undefined;
  notesLabel: string | undefined;
  notes: string | undefined;
  group: string | undefined;
  refresh: number;
  // hidden
  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
  version: number;
  lastUpdated: number;
}

export interface IV2Character {
  id: string;
  name: string;
  aspects: ICharacterCustomField<string>;
  skills: ICharacterCustomField<string>;
  stunts: ICharacterCustomField<string>;
  stressTracks: ICharacterCustomField<
    Array<{ checked?: boolean; label: string }>
  >;
  consequences: ICharacterCustomField<string>;
  aspectsLabel: string | undefined;
  skillsLabel: string | undefined;
  stuntsLabel: string | undefined;
  stressTracksLabel: string | undefined;
  consequencesLabel: string | undefined;
  refreshLabel: string | undefined;
  notesLabel: string | undefined;
  notes: string | undefined;
  group: string | undefined;
  refresh: number;
  // hidden
  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
  version: number;
  lastUpdated: number;
}

export type ICharacterCustomField<TValue> = Array<{
  name: string;
  value: TValue;
}>;

export type IField<T = any> = {
  id: string;
  label: string;
  value: T;
};

export type ISection<T = any> = {
  label: string;
  id: string;
  position: Position;
  type: SectionType;
  fields: Array<IField<T>>;
  visibleOnCard?: boolean;
};

export type CheckboxesFieldValue = Array<{
  label: string;
  checked?: boolean;
}>;

export function makeField(type: SectionType) {
  const fieldDefault: Record<SectionType, IField> = {
    [SectionType.Text]: {
      id: Id.generate(),
      label: "Text",
      value: "",
    } as IField<string>,
    [SectionType.Number]: {
      id: Id.generate(),
      label: "Text",
      value: "0",
    } as IField<string>,
    [SectionType.Checkboxes]: {
      id: Id.generate(),
      label: "Text",
      value: [{ label: "1", checked: false }],
    } as IField<CheckboxesFieldValue>,
  };

  return fieldDefault[type];
}

export interface IPage {
  id: string;
  sections: Array<ISection>;
}

export interface ICharacter {
  id: string;
  name: string;
  group: string | undefined;
  refresh: number;

  pages: Array<IPage>;

  // hidden
  version: number;
  lastUpdated: number;

  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
}

export function migrateCharacters(characters: Array<any>) {
  return characters.map((c) => {
    return migrateCharacter(c);
  }) as Array<ICharacter>;
}

export function migrateCharacter(c: any) {
  try {
    const v2: IV2Character = migrateV1Character(c);
    const v3: ICharacter = migrateV2Character(v2);
    return v3;
  } catch (error) {
    console.error(error);
    return c;
  }
}

export function migrateV1Character(v1: IV1Character): IV2Character {
  if (v1.version !== 1) {
    return (v1 as unknown) as IV2Character;
  }

  return (produce<IV1Character, IV2Character>(v1, (draft) => {
    // stress box values used to be booleans, now they are `{ checked?: boolean; label: string }`
    draft.stressTracks.forEach((s) => {
      s.value = s.value.map((box, index) => {
        return {
          checked: (box as unknown) as boolean,
          label: `${index + 1}`,
        };
      });
    });
    draft.version = 2;
  }) as unknown) as IV2Character;
}

export function migrateV2Character(v2: IV2Character): ICharacter {
  if (v2.version !== 2) {
    return (v2 as unknown) as ICharacter;
  }

  const sections: Array<ISection> = [];

  // aspects
  sections.push({
    id: Id.generate(),
    label: v2.aspectsLabel ?? "Aspects",
    visibleOnCard: true,
    position: Position.Left,
    type: SectionType.Text,
    fields: v2.aspects.map((a) => {
      return { id: Id.generate(), label: a.name, value: a.value };
    }),
  });

  // stunts
  sections.push({
    id: Id.generate(),
    label: v2.stuntsLabel ?? "Stunts & Extras",
    position: Position.Left,
    type: SectionType.Text,
    fields: v2.stunts.map((a) => {
      return { id: Id.generate(), label: a.name, value: a.value };
    }),
  });

  // notes
  sections.push({
    id: Id.generate(),
    label: v2.notesLabel ?? "Other",
    position: Position.Left,
    type: SectionType.Text,
    fields: [{ id: Id.generate(), label: "Notes", value: v2.notes ?? "" }],
  });

  // stress
  sections.push({
    id: Id.generate(),
    label: v2.stressTracksLabel ?? "Stress",
    position: Position.Right,
    type: SectionType.Checkboxes,
    fields: v2.stressTracks.map((st) => {
      return { id: Id.generate(), label: st.name, value: st.value };
    }),
  });

  // consequences
  sections.push({
    id: Id.generate(),
    label: v2.consequencesLabel ?? "Consequences",
    position: Position.Right,
    type: SectionType.Text,
    fields: v2.consequences.map((a) => {
      return { id: Id.generate(), label: a.name, value: a.value };
    }),
  });

  // skills
  sections.push({
    id: Id.generate(),
    label: v2.skillsLabel ?? "Skills",
    visibleOnCard: true,
    position: Position.Right,
    type: SectionType.Number,
    fields: v2.skills.map((a) => {
      return { id: Id.generate(), label: a.name, value: a.value };
    }),
  });

  return {
    id: v2.id,
    name: v2.name,
    group: v2.group,
    lastUpdated: v2.lastUpdated,
    pages: [
      {
        id: Id.generate(),
        sections: sections,
      },
    ],
    fatePoints: v2.fatePoints,
    playedDuringTurn: v2.playedDuringTurn,
    refresh: v2.refresh,
    version: CharacterFactory.latestVersion,
  };
}
