import produce from "immer";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../Id/Id";
import { makeDnD5eCharacter } from "./character-templates/makeDnD5eCharacter";
import { makeEmptyCharacter } from "./character-templates/makeEmptyCharacter";
import { makeFateAcceleratedCharacter } from "./character-templates/makeFateAcceleratedCharacter";
import { makeFateCondensedCharacter } from "./character-templates/makeFateCondensedCharacter";
import { makeFateOfCthulhuCharacter } from "./character-templates/makeFateOfCthulhuCharacter";
import { makeTheWitchIsDeadCharacter } from "./character-templates/makeTheWitchIsDeadCharacter";
import { CharacterType } from "./CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IDicePoolBlock,
  IPage,
  IPointCounterBlock,
  IRichTextBlock,
  ISection,
  ISkillBlock,
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
      [CharacterType.CoreCondensed]: makeFateCondensedCharacter,
      [CharacterType.Accelerated]: makeFateAcceleratedCharacter,
      [CharacterType.FateOfCthulhu]: makeFateOfCthulhuCharacter,
      [CharacterType.Dnd5e]: makeDnD5eCharacter,
      [CharacterType.TheWitchIsDead]: makeTheWitchIsDeadCharacter,
      [CharacterType.Blank]: makeEmptyCharacter,
    }[type]();

    return {
      ...newCharacter,
      id: Id.generate(),
      name: "",
      lastUpdated: getUnix(),
    };
  },
  makeTemplate(props: { name: string; pages: Array<IPage> }): ICharacter {
    return {
      id: Id.generate(),
      version: CharacterFactory.latestVersion,
      name: props.name,
      group: undefined,
      lastUpdated: getUnix(),
      pages: props.pages,
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
        meta: {
          checked: undefined,
        },
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
        meta: {
          checked: undefined,
        },
      } as IBlock & ISkillBlock,
      [BlockType.DicePool]: {
        id: Id.generate(),
        label: "Dice Pool",
        type: type,
        value: "",
        meta: {
          commands: undefined,
        },
      } as IBlock & IDicePoolBlock,
      [BlockType.PointCounter]: {
        id: Id.generate(),
        label: "Point Counter",
        type: type,
        meta: {
          max: undefined,
          isMainPointCounter: false,
        },
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
  duplicateBlock(block: IBlock): IBlock {
    return {
      ...block,
      id: Id.generate(),
    };
  },
};

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
        meta: {},
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
        meta: {},
        label: a.name,
        value: a.value,
      };
    }),
  });

  // fate points
  sections.push({
    id: Id.generate(),
    label: "Fate Points",
    position: Position.Left,
    blocks: [
      {
        id: Id.generate(),
        type: BlockType.PointCounter,
        meta: {
          isMainPointCounter: true,
          max: v2.refresh?.toString() ?? "3",
        },
        label: "Fate Points",
        value: v2.fatePoints?.toString() ?? "3",
      },
    ],
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
        meta: {},
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
        meta: {},
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
        meta: {},
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
        meta: {},
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
        label: "Character",
        sections: sections,
      },
    ],
    playedDuringTurn: v2.playedDuringTurn,
    version: CharacterFactory.latestVersion,
  };
}
