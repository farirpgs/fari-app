import produce from "immer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { ManagerMode } from "../../components/Manager/Manager";
import { arraySort } from "../../domains/array/arraySort";
import { getUnix, getUnixFrom } from "../../domains/dayjs/getDayJS";
import { useGroups } from "../../hooks/useGroups/useGroups";

export enum CharacterType {
  CoreCondensed = "CoreCondensed",
  Accelerated = "Accelerated",
  Custom = "Custom",
}

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
    const defaultCharacter = defaultCharactersByType[type];
    const newCharacter = {
      ...defaultCharacter,
      id: uuidV4(),
      lastUpdated: getUnix(),
    } as ICharacter;
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
export enum SectionType {
  Text,
  Number,
  // BigNumber,
  Checkboxes,
}

export enum Position {
  Left,
  Right,
}

const defaultCondensedCharacter: ICharacter = {
  id: "",
  name: "",
  group: undefined,
  sections: [
    {
      label: "Aspects",
      type: SectionType.Text,
      position: Position.Left,
      fields: [
        { label: "High Concept", value: "" },
        { label: "Trouble", value: "" },
        { label: "Relationship", value: "" },
        { label: "Other Aspect", value: "" },
        { label: "Other Aspect", value: "" },
      ],
    },
    {
      label: "Stunts & Extras",
      type: SectionType.Text,
      position: Position.Left,
      fields: [
        { label: "Stunt #1", value: "" },
        { label: "Stunt #2", value: "" },
        { label: "Stunt #3", value: "" },
      ],
    },
    {
      label: "Other",
      type: SectionType.Text,
      position: Position.Left,
      fields: [{ label: "Notes", value: "" }],
    },
    {
      label: "Stress",
      type: SectionType.Checkboxes,
      position: Position.Right,
      fields: [
        {
          label: "Physical",
          value: [
            { checked: false, label: "1" },
            { checked: false, label: "2" },
            { checked: false, label: "3" },
          ],
        },
        {
          label: "Mental",
          value: [
            { checked: false, label: "1" },
            { checked: false, label: "2" },
            { checked: false, label: "3" },
          ],
        },
      ],
    },
    {
      label: "Consequences",
      type: SectionType.Text,
      position: Position.Right,
      fields: [
        { label: "Mild", value: "" },
        { label: "Moderate", value: "" },
        { label: "Severe", value: "" },
      ],
    },
    {
      label: "Skills",
      type: SectionType.Number,
      position: Position.Right,
      fields: [
        { label: "Academics", value: "" },
        { label: "Athletics", value: "" },
        { label: "Burglary", value: "" },
        { label: "Contacts", value: "" },
        { label: "Crafts", value: "" },
        { label: "Deceive", value: "" },
        { label: "Drive", value: "" },
        { label: "Empathy", value: "" },
        { label: "Fight", value: "" },
        { label: "Investigate", value: "" },
        { label: "Lore", value: "" },
        { label: "Notice", value: "" },
        { label: "Physique", value: "" },
        { label: "Provoke", value: "" },
        { label: "Rapport", value: "" },
        { label: "Resources", value: "" },
        { label: "Shoot", value: "" },
        { label: "Stealth", value: "" },
        { label: "Will", value: "" },
      ],
    },
  ],
  refresh: 3,
  fatePoints: undefined,
  playedDuringTurn: undefined,
  version: 2,
  lastUpdated: getUnix(),
};

const defaultAcceleratedCharacter: ICharacter = {
  id: "",
  name: "",
  group: undefined,
  sections: [
    {
      label: "Aspects",
      type: SectionType.Text,
      position: Position.Left,
      fields: [
        { label: "High Concept", value: "" },
        { label: "Trouble", value: "" },
        { label: "Relationship", value: "" },
        { label: "Other Aspect", value: "" },
        { label: "Other Aspect", value: "" },
      ],
    },
    {
      label: "Stunts & Extras",
      type: SectionType.Text,
      position: Position.Left,
      fields: [
        { label: "Stunt #1", value: "" },
        { label: "Stunt #2", value: "" },
        { label: "Stunt #3", value: "" },
      ],
    },
    {
      label: "Other",
      type: SectionType.Text,
      position: Position.Left,
      fields: [{ label: "Notes", value: "" }],
    },
    {
      label: "Stress",
      type: SectionType.Checkboxes,
      position: Position.Right,
      fields: [
        {
          label: "Stress",
          value: [
            { checked: false, label: "1" },
            { checked: false, label: "2" },
            { checked: false, label: "3" },
          ],
        },
      ],
    },
    {
      label: "Consequences",
      type: SectionType.Text,
      position: Position.Right,
      fields: [
        { label: "Mild", value: "" },
        { label: "Moderate", value: "" },
        { label: "Severe", value: "" },
      ],
    },
    {
      label: "Skills",
      type: SectionType.Number,
      position: Position.Right,
      fields: [
        { label: "Careful", value: "" },
        { label: "Clever", value: "" },
        { label: "Forceful", value: "" },
        { label: "Flashy", value: "" },
        { label: "Quick", value: "" },
        { label: "Sneaky", value: "" },
      ],
    },
  ],
  refresh: 3,
  fatePoints: undefined,
  playedDuringTurn: undefined,
  version: 2,
  lastUpdated: getUnix(),
};

const defaultCustomCharacter: ICharacter = {
  id: "",
  name: "",
  group: undefined,
  sections: [],
  refresh: 3,
  fatePoints: undefined,
  playedDuringTurn: undefined,
  version: 2,
  lastUpdated: getUnix(),
};

export const defaultCharactersByType = {
  [CharacterType.CoreCondensed]: defaultCondensedCharacter,
  [CharacterType.Accelerated]: defaultAcceleratedCharacter,
  [CharacterType.Custom]: defaultCustomCharacter,
} as const;

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
  label: string;
  value: T;
};

export type ISection<T = any> = {
  label: string;
  position: Position;
  type: SectionType;
  fields: Array<IField<T>>;
};

export type CheckboxesFieldValue = Array<{
  label: string;
  checked?: boolean;
}>;

export const DefaultFields: Record<SectionType, IField> = {
  [SectionType.Text]: { label: "Text", value: "" } as IField<string>,
  [SectionType.Number]: { label: "Number", value: "0" } as IField<string>,
  [SectionType.Checkboxes]: {
    label: "Checkboxes",
    value: [{ label: "1", checked: false }],
  } as IField<CheckboxesFieldValue>,
};

export interface ICharacter {
  id: string;
  name: string;
  group: string | undefined;
  refresh: number;
  sections: Array<ISection>;

  // hidden
  version: number;
  lastUpdated: number;

  fatePoints: number | undefined;
  playedDuringTurn: boolean | undefined;
}

export function migrateCharacters(characters: Array<any>) {
  return characters.map((c) => {
    return migrateCharacter(c);
  });
}

export function migrateCharacter(c: any) {
  const v2: IV2Character = migrateV1Character(c);
  const v3: ICharacter = migrateV2Character(v2);
  return v3;
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
    label: v2.aspectsLabel ?? "Aspects",
    position: Position.Left,
    type: SectionType.Text,
    fields: v2.aspects.map((a) => {
      return { label: a.name, value: a.value };
    }),
  });

  // stunts
  sections.push({
    label: v2.stuntsLabel ?? "Stunts & Extras",
    position: Position.Left,
    type: SectionType.Text,
    fields: v2.stunts.map((a) => {
      return { label: a.name, value: a.value };
    }),
  });

  // notes
  sections.push({
    label: v2.notesLabel ?? "Other",
    position: Position.Left,
    type: SectionType.Text,
    fields: [{ label: "Notes", value: v2.notes ?? "" }],
  });

  // stress
  sections.push({
    label: v2.stressTracksLabel ?? "Stress",
    position: Position.Right,
    type: SectionType.Checkboxes,
    fields: v2.stressTracks.map((st) => {
      return { label: st.name, value: st.value };
    }),
  });

  // consequences
  sections.push({
    label: v2.consequencesLabel ?? "Consequences",
    position: Position.Right,
    type: SectionType.Text,
    fields: v2.consequences.map((a) => {
      return { label: a.name, value: a.value };
    }),
  });

  // skills
  sections.push({
    label: v2.skillsLabel ?? "Skills",
    position: Position.Right,
    type: SectionType.Number,
    fields: v2.skills.map((a) => {
      return { label: a.name, value: a.value };
    }),
  });

  return {
    id: v2.id,
    name: v2.name,
    group: v2.group,
    lastUpdated: v2.lastUpdated,
    sections: sections,
    fatePoints: v2.fatePoints,
    playedDuringTurn: v2.playedDuringTurn,
    refresh: v2.refresh,
    version: 3,
  };
}
