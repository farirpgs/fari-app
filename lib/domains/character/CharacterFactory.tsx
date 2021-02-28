import produce from "immer";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../id/Id";
import { CharacterType } from "./CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IPointCounterBlock,
  IRichTextBlock,
  ISection,
  ISkillTextBlock,
  ISlotTrackerBlock,
  ITextBlock,
  IV1Character,
  IV2Character,
  Position,
} from "./types";

export const CharacterFactory = {
  latestVersion: 3,
  make(type: CharacterType): ICharacter {
    const newCharacter = {
      [CharacterType.CoreCondensed]: makeCondensedCharacter,
      [CharacterType.Accelerated]: makeAcceleratedCharacter,
      [CharacterType.Empty]: makeEmptyCharacter,
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
  makeBlock(type: BlockType) {
    const blockDefault: Record<BlockType, IBlock> = {
      [BlockType.Text]: {
        id: Id.generate(),
        label: "Text",
        type: type,
        value: "",
      } as IBlock & ITextBlock,
      [BlockType.RichText]: {
        id: Id.generate(),
        label: "Rich Text",
        type: type,
        value: "",
      } as IBlock & IRichTextBlock,
      [BlockType.Skill]: {
        id: Id.generate(),
        label: "Skill",
        type: type,
        value: "0",
      } as IBlock & ISkillTextBlock,
      [BlockType.PointCounter]: {
        id: Id.generate(),
        label: "Point Counter",
        type: type,
        value: "0",
      } as IBlock & IPointCounterBlock,
      [BlockType.SlotTracker]: {
        id: Id.generate(),
        label: "Slot Tracker",
        type: type,
        value: [{ label: "1", checked: false }],
      } as IBlock & ISlotTrackerBlock,
    };

    return blockDefault[type];
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
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "High Concept",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Trouble",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Relationship",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Other Aspect",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Other Aspect",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Stunt #1",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Stunt #2",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Stunt #3",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Other",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Notes",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Fate Points",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.PointCounter,
                label: "Fate Points",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Stress",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                label: "Physical",
                type: BlockType.SlotTracker,
                value: [
                  {
                    checked: false,
                    label: "1",
                  },
                  {
                    checked: false,
                    label: "2",
                  },
                  {
                    checked: false,
                    label: "3",
                  },
                ],
              },
              {
                id: Id.generate(),
                label: "Mental",
                type: BlockType.SlotTracker,
                value: [
                  { checked: false, label: "1" },
                  { checked: false, label: "2" },
                  { checked: false, label: "3" },
                ],
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Consequences",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Mild",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Moderate",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Severe",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            visibleOnCard: true,
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Academics",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Athletics",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Burglary",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Contacts",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Crafts",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Deceive",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Drive",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Empathy",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Fight",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Investigate",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Lore",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Notice",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Physique",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Provoke",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Rapport",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Resources",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Shoot",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Stealth",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Will",
                value: "",
              },
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

            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "High Concept",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Trouble",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Relationship",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Other Aspect",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Other Aspect",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",

            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Stunt #1",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Stunt #2",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Stunt #3",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Other",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Notes",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Stress",

            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.SlotTracker,
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
            id: Id.generate(),
            label: "Consequences",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Mild",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Moderate",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                label: "Severe",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            visibleOnCard: true,

            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Careful",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Clever",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Forceful",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Flashy",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Quick",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                label: "Sneaky",
                value: "",
              },
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

function makeEmptyCharacter(): ICharacter {
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
    blocks: v2.aspects.map((a) => {
      return {
        id: Id.generate(),
        type: BlockType.Text,
        label: a.name,
        value: a.value,
      };
    }),
  });

  // stunts
  sections.push({
    id: Id.generate(),
    label: v2.stuntsLabel ?? "Stunts & Extras",
    position: Position.Left,
    blocks: v2.stunts.map((a) => {
      return {
        id: Id.generate(),
        type: BlockType.Text,
        label: a.name,
        value: a.value,
      };
    }),
  });

  // notes
  sections.push({
    id: Id.generate(),
    label: v2.notesLabel ?? "Other",
    position: Position.Left,
    blocks: [
      {
        id: Id.generate(),
        type: BlockType.Text,
        label: "Notes",
        value: v2.notes ?? "",
      },
    ],
  });

  // stress
  sections.push({
    id: Id.generate(),
    label: v2.stressTracksLabel ?? "Stress",
    position: Position.Right,
    blocks: v2.stressTracks.map((st) => {
      return {
        id: Id.generate(),
        type: BlockType.SlotTracker,
        label: st.name,
        value: st.value,
      };
    }),
  });

  // consequences
  sections.push({
    id: Id.generate(),
    label: v2.consequencesLabel ?? "Consequences",
    position: Position.Right,

    blocks: v2.consequences.map((a) => {
      return {
        id: Id.generate(),
        type: BlockType.Text,
        label: a.name,
        value: a.value,
      };
    }),
  });

  // skills
  sections.push({
    id: Id.generate(),
    label: v2.skillsLabel ?? "Skills",
    visibleOnCard: true,
    position: Position.Right,

    blocks: v2.skills.map((a) => {
      return {
        id: Id.generate(),
        type: BlockType.Skill,
        label: a.name,
        value: a.value,
      };
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
