import produce from "immer";
import { getUnix } from "../dayjs/getDayJS";
import { IDiceCommandSetId } from "../dice/Dice";
import { Id } from "../Id/Id";
import { Migrator } from "../migration/Migrator";
import { ICharacterTemplate } from "./CharacterType";
import {
  BlockType,
  IBlock,
  IBlockTypes,
  ICharacter,
  IDicePoolBlock,
  IImageBlock,
  ILinkBlock,
  INumericBlock,
  IPage,
  IPointCounterBlock,
  ISection,
  ISeparatorBlock,
  ISkillBlock,
  ISlotTrackerBlock,
  ITextBlock,
  IV1Character,
  IV2Character,
  IV3Character,
  IV3Section,
  IV4Character,
  IV4Page,
  V3Position
} from "./types";

export const CharacterFactory = {
  latestVersion: 4,
  async make(template: ICharacterTemplate): Promise<ICharacter> {
    const result = await template.importFunction();
    const newCharacter = this.makeFromJson(result);
    return {
      ...newCharacter,
      id: Id.generate(),
      name: "",
      group: undefined,
      lastUpdated: getUnix(),
    };
  },
  makeFromJson(jsonData: any): ICharacter {
    const newSheet = {
      ...jsonData,
      // to clear ViteJS default value from json import
      default: undefined,
    };
    const migratedSheet = this.migrate(newSheet);
    return migratedSheet;
  },
  migrate(character: any): ICharacter {
    try {
      const migrate = Migrator.makeMigrationFunction<ICharacter>([
        {
          from: 1,
          migrate: migrateV1CharacterToV2,
        },
        {
          from: 2,
          migrate: migrateV2CharacterToV3,
        },
        {
          from: 3,
          migrate: migrateV3CharacterToV4,
        },
        {
          from: 4,
          migrate: migrateV4CharacterToV5,
        },
      ]);
      const migrated = migrate(character);
      return migrated;
    } catch (error) {
      console.error(error);
      return character;
    }
  },
  duplicate(c: ICharacter): ICharacter {
    return {
      ...c,
      id: Id.generate(),
      lastUpdated: getUnix(),
      name: `${c?.name} Copy`,
    };
  },
  makeATemplate(c: ICharacter): Omit<ICharacter, "id"> & { id: undefined } {
    return {
      ...c,
      id: undefined,
      lastUpdated: getUnix(),
      name: `${c?.name} Template`,
    };
  },
  makeBlock<TType extends IBlockTypes>(
    type: BlockType,
    options: {
      defaultCommands?: Array<IDiceCommandSetId> | null;
    } = {}
  ) {
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
      [BlockType.Numeric]: {
        id: Id.generate(),
        label: "Numeric",
        type: type,
        value: "",
        meta: {
          checked: undefined,
        },
      } as IBlock & INumericBlock,
      [BlockType.Skill]: {
        id: Id.generate(),
        label: "Skill",
        type: type,
        value: "0",
        meta: {
          checked: undefined,
          commands: options.defaultCommands,
        },
      } as IBlock & ISkillBlock,
      [BlockType.DicePool]: {
        id: Id.generate(),
        label: "Dice Pool",
        type: type,
        value: "",
        meta: {
          commands: options.defaultCommands,
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
        meta: {},
        value: [{ label: "", checked: false }],
      } as IBlock & ISlotTrackerBlock,
      [BlockType.Image]: {
        id: Id.generate(),
        label: "",
        type: type,
        meta: {},
        value: "",
      } as IBlock & IImageBlock,
      [BlockType.Link]: {
        id: Id.generate(),
        label: "",
        type: type,
        meta: { hasDisplayName: false },
        value: "",
      } as IBlock & ILinkBlock,
      [BlockType.Separator]: {
        id: Id.generate(),
        label: "",
        type: type,
        meta: { hasLabel: false },
        value: "",
      } as IBlock & ISeparatorBlock,
    };

    return blockDefault[type] as IBlock & TType;
  },
  duplicateBlock(block: IBlock): IBlock {
    return produce(block, (draft) => {
      draft.id = Id.generate();
    });
  },
  duplicateSection(section: ISection): ISection {
    return produce(section, (draft) => {
      draft.id = Id.generate();
      draft.label += " Copy";
      draft.blocks.forEach((b) => {
        b.id = Id.generate();
      });
    });
  },
  duplicatePage(page: IPage): IPage {
    return produce(page, (draft) => {
      draft.id = Id.generate();
      draft.label += " Copy";

      draft.rows.forEach((r) => {
        r.columns.forEach((c) => {
          c.sections.forEach((s) => {
            s.id = Id.generate();
            s.blocks.forEach((b) => {
              b.id = Id.generate();
            });
          });
        });
      });
    });
  },
};

export function migrateV1CharacterToV2(v1: IV1Character): IV2Character {
  if (v1.version !== 1) {
    return v1 as unknown as IV2Character;
  }

  return produce<IV1Character, IV2Character>(v1, (draft) => {
    // stress box values used to be booleans, now they are `{ checked?: boolean; label: string }`
    draft.stressTracks.forEach((s) => {
      s.value = s.value.map((box, index) => {
        return {
          checked: box as unknown as boolean,
          label: `${index + 1}`,
        };
      });
    });
    draft.version = 2;
  }) as unknown as IV2Character;
}

export function migrateV2CharacterToV3(v2: IV2Character): IV3Character {
  if (v2.version !== 2) {
    return v2 as unknown as IV3Character;
  }

  const sections: Array<IV3Section> = [];

  // aspects
  sections.push({
    id: Id.generate(),
    label: v2.aspectsLabel ?? "Aspects",
    visibleOnCard: true,
    position: V3Position.Left,
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
    position: V3Position.Left,
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
    position: V3Position.Left,
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
    position: V3Position.Left,
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
    position: V3Position.Right,
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
    position: V3Position.Right,
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
    position: V3Position.Right,
    blocks: v2.skills.map((a) => {
      return {
        id: Id.generate(),
        type: BlockType.Skill,
        meta: {
          commands: ["4dF"],
        },
        label: a.name,
        value: a.value,
      } as IBlock & ISkillBlock;
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
    version: 3,
  };
}

export function migrateV3CharacterToV4(v3: IV3Character): IV4Character {
  if (v3.version !== 3) {
    return v3 as unknown as IV4Character;
  }

  const v4: IV4Character = {
    id: v3.id,
    name: v3.name,
    group: v3.group,
    lastUpdated: v3.lastUpdated,
    wide: false,
    pages: v3.pages.map((page): IV4Page => {
      const leftSections = page.sections.filter(
        (s) => s.position === V3Position.Left
      );
      const rightSections = page.sections.filter(
        (s) => s.position === V3Position.Right
      );
      return {
        id: page.id,
        label: page.label,
        sections: {
          left: leftSections.map((s) => ({
            id: s.id,
            blocks: s.blocks,
            label: s.label,
            visibleOnCard: s.visibleOnCard,
          })),
          right: rightSections.map((s) => ({
            id: s.id,
            blocks: s.blocks,
            label: s.label,
            visibleOnCard: s.visibleOnCard,
          })),
        },
      };
    }),
    playedDuringTurn: v3.playedDuringTurn,
    version: 4,
  };
  return v4;
}

function migrateV4CharacterToV5(v4: IV4Character): ICharacter {
  const v5: ICharacter = {
    id: v4.id,
    name: v4.name,
    group: v4.group,
    lastUpdated: v4.lastUpdated,
    wide: false,
    pages: v4.pages.map((page): IPage => {
      return {
        id: page.id,
        label: page.label,
        rows: [
          {
            columns: [
              { sections: page.sections.left },
              { sections: page.sections.right },
            ],
          },
        ],
      };
    }),
    playedDuringTurn: v4.playedDuringTurn,
    version: 5,
  };

  return v5;
}
