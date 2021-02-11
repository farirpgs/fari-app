import produce from "immer";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../id/Id";
import { CharacterType } from "./CharacterType";
import {
  CheckboxesFieldValue,
  ICharacter,
  IField,
  ISection,
  IV1Character,
  IV2Character,
  Position,
  SectionType,
} from "./types";

export const CharacterFactory = {
  latestVersion: 3,
  make(type: CharacterType): ICharacter {
    const newCharacter = {
      [CharacterType.CoreCondensed]: makeCondensedCharacter,
      [CharacterType.Accelerated]: makeAcceleratedCharacter,
      [CharacterType.Custom]: makeCustomCharacter,
    }[type]();

    return {
      ...newCharacter,
      id: Id.generate(),
      name: "",
      lastUpdated: getUnix(),
    };
  },
  migrate(c: any): ICharacter {
    try {
      const v2: IV2Character = migrateV1CharacterToV2(c);
      const v3: ICharacter = migrateV2CharacterToV3(v2);
      return v3;
    } catch (error) {
      console.error(error);
      return c;
    }
  },
  makeField(type: SectionType) {
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
      [SectionType.RichText]: {
        id: Id.generate(),
        label: "Rich Text",
        value: "",
      } as IField<string>,
    };

    return fieldDefault[type];
  },
};

function makeCondensedCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    pages: [
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Aspects",
            visibleOnCard: true,
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "High Concept", value: "" },
              { id: Id.generate(), label: "Trouble", value: "" },
              { id: Id.generate(), label: "Relationship", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "Stunt #1", value: "" },
              { id: Id.generate(), label: "Stunt #2", value: "" },
              { id: Id.generate(), label: "Stunt #3", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Other",
            type: SectionType.Text,
            position: Position.Left,
            fields: [{ id: Id.generate(), label: "Notes", value: "" }],
          },
          {
            id: Id.generate(),
            label: "Stress",
            type: SectionType.Checkboxes,
            position: Position.Right,
            fields: [
              {
                id: Id.generate(),
                label: "Physical",
                value: [
                  { checked: false, id: Id.generate(), label: "1" },
                  { checked: false, id: Id.generate(), label: "2" },
                  { checked: false, id: Id.generate(), label: "3" },
                ],
              },
              {
                id: Id.generate(),
                label: "Mental",
                value: [
                  { checked: false, id: Id.generate(), label: "1" },
                  { checked: false, id: Id.generate(), label: "2" },
                  { checked: false, id: Id.generate(), label: "3" },
                ],
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Consequences",
            type: SectionType.Text,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Mild", value: "" },
              { id: Id.generate(), label: "Moderate", value: "" },
              { id: Id.generate(), label: "Severe", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            visibleOnCard: true,
            type: SectionType.Number,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Academics", value: "" },
              { id: Id.generate(), label: "Athletics", value: "" },
              { id: Id.generate(), label: "Burglary", value: "" },
              { id: Id.generate(), label: "Contacts", value: "" },
              { id: Id.generate(), label: "Crafts", value: "" },
              { id: Id.generate(), label: "Deceive", value: "" },
              { id: Id.generate(), label: "Drive", value: "" },
              { id: Id.generate(), label: "Empathy", value: "" },
              { id: Id.generate(), label: "Fight", value: "" },
              { id: Id.generate(), label: "Investigate", value: "" },
              { id: Id.generate(), label: "Lore", value: "" },
              { id: Id.generate(), label: "Notice", value: "" },
              { id: Id.generate(), label: "Physique", value: "" },
              { id: Id.generate(), label: "Provoke", value: "" },
              { id: Id.generate(), label: "Rapport", value: "" },
              { id: Id.generate(), label: "Resources", value: "" },
              { id: Id.generate(), label: "Shoot", value: "" },
              { id: Id.generate(), label: "Stealth", value: "" },
              { id: Id.generate(), label: "Will", value: "" },
            ],
          },
        ],
      },
    ],
    refresh: 3,
    fatePoints: undefined,
    playedDuringTurn: undefined,

    lastUpdated: getUnix(),
  };
}

function makeAcceleratedCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    pages: [
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Aspects",
            visibleOnCard: true,
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "High Concept", value: "" },
              { id: Id.generate(), label: "Trouble", value: "" },
              { id: Id.generate(), label: "Relationship", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "Stunt #1", value: "" },
              { id: Id.generate(), label: "Stunt #2", value: "" },
              { id: Id.generate(), label: "Stunt #3", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Other",
            type: SectionType.Text,
            position: Position.Left,
            fields: [{ id: Id.generate(), label: "Notes", value: "" }],
          },
          {
            id: Id.generate(),
            label: "Stress",
            type: SectionType.Checkboxes,
            position: Position.Right,
            fields: [
              {
                id: Id.generate(),
                label: "Stress",
                value: [
                  { checked: false, id: Id.generate(), label: "1" },
                  { checked: false, id: Id.generate(), label: "2" },
                  { checked: false, id: Id.generate(), label: "3" },
                ],
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Consequences",
            type: SectionType.Text,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Mild", value: "" },
              { id: Id.generate(), label: "Moderate", value: "" },
              { id: Id.generate(), label: "Severe", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            visibleOnCard: true,
            type: SectionType.Number,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Careful", value: "" },
              { id: Id.generate(), label: "Clever", value: "" },
              { id: Id.generate(), label: "Forceful", value: "" },
              { id: Id.generate(), label: "Flashy", value: "" },
              { id: Id.generate(), label: "Quick", value: "" },
              { id: Id.generate(), label: "Sneaky", value: "" },
            ],
          },
        ],
      },
    ],
    refresh: 3,
    fatePoints: undefined,
    playedDuringTurn: undefined,

    lastUpdated: getUnix(),
  };
}

function makeCustomCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    pages: [
      {
        id: Id.generate(),
        sections: [],
      },
    ],
    refresh: 3,
    fatePoints: undefined,
    playedDuringTurn: undefined,

    lastUpdated: getUnix(),
  };
}

export function migrateV1CharacterToV2(v1: IV1Character): IV2Character {
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

export function migrateV2CharacterToV3(v2: IV2Character): ICharacter {
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
