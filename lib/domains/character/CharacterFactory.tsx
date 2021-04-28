import produce from "immer";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../Id/Id";
import { makeBlankCharacter } from "./character-templates/makeBlankCharacter";
import { makeDnD5eCharacter } from "./character-templates/makeDnD5eCharacter";
import { makeFateAcceleratedCharacter } from "./character-templates/makeFateAcceleratedCharacter";
import { makeFateCondensedCharacter } from "./character-templates/makeFateCondensedCharacter";
import { makeFateCoreCharacter } from "./character-templates/makeFateCoreCharacter";
import { makeFateOfCthulhuCharacter } from "./character-templates/makeFateOfCthulhuCharacter";
import { CharacterTemplates } from "./CharacterType";
import {
  BlockType,
  IBlock,
  ICharacter,
  IDicePoolBlock,
  IImageBlock,
  INumericBlock,
  IPage,
  IPointCounterBlock,
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
  async make(type: CharacterTemplates): Promise<ICharacter> {
    const templateFunctions: Record<
      CharacterTemplates,
      () => Promise<ICharacter>
    > = {
      /**
       * @author @RPDeshaies
       */
      [CharacterTemplates.FateCondensed]: async () =>
        makeFateCondensedCharacter(),
      /**
       * @author @RPDeshaies
       */
      [CharacterTemplates.FateCore]: async () => makeFateCoreCharacter(),
      /**
       * @author @RPDeshaies
       */
      [CharacterTemplates.FateAccelerated]: async () =>
        makeFateAcceleratedCharacter(),
      /**
       * @author @RPDeshaies
       */
      [CharacterTemplates.FateOfCthulhu]: async () =>
        makeFateOfCthulhuCharacter(),
      /**
       * @author @LostInBrittany
       */
      [CharacterTemplates.DresdenFilesAccelerated]: async () => {
        const jsonData = await import(
          "./character-templates/DrescendFilesAccelerated.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.Heartbreaker]: async () => {
        const jsonData = await import(
          "./character-templates/Heartbreaker.json"
        );
        return this.makeFromJson(jsonData);
      },
      /**
       * @author @Pheylorn
       */
      [CharacterTemplates.IronEddaAccelerated]: async () => {
        const jsonData = await import(
          "./character-templates/IronEddaAccelerated.json"
        );
        return this.makeFromJson(jsonData);
      },
      /**
       * @author @bhogan
       */
      [CharacterTemplates.Maze]: async () => {
        const jsonData = await import("./character-templates/Maze.json");
        return this.makeFromJson(jsonData);
      },
      /**
       * @author @Owlbear
       */
      [CharacterTemplates.VentureCity]: async () => {
        const jsonData = await import("./character-templates/VentureCity.json");
        return this.makeFromJson(jsonData);
      },
      /**
       * @author @RPDeshaies
       */
      [CharacterTemplates.Dnd5e]: async () => makeDnD5eCharacter(),
      /**
       * @author @RPDeshaies
       */
      [CharacterTemplates.TheWitchIsDead]: async () => {
        const jsonData = await import(
          "./character-templates/TheWitchIsDead.json"
        );
        return this.makeFromJson(jsonData);
      },
      /**
       * @author sorcho
       */
      [CharacterTemplates.ThePool]: async () => {
        const jsonData = await import("./character-templates/ThePool.json");
        return this.makeFromJson(jsonData);
      },
      /**
       * @author sorcho
       */
      [CharacterTemplates.TunnelsAndTrolls]: async () => {
        const jsonData = await import(
          "./character-templates/TunnelsAndTrolls.json"
        );
        return this.makeFromJson(jsonData);
      },
      /**
       * @author Afty
       */
      [CharacterTemplates.StrandsOfFate]: async () => {
        const jsonData = await import(
          "./character-templates/StrandsOfFate.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.EvolutionPulse_Hydrah]: async () => {
        const jsonData = await import(
          "./character-templates/EvolutionPulse/Hydrah.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.EvolutionPulse_Hyonos]: async () => {
        const jsonData = await import(
          "./character-templates/EvolutionPulse/Hyonos.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.EvolutionPulse_LostH]: async () => {
        const jsonData = await import(
          "./character-templates/EvolutionPulse/LostH.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.EvolutionPulse_Obscura]: async () => {
        const jsonData = await import(
          "./character-templates/EvolutionPulse/Obscura.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.EvolutionPulse_Proxy]: async () => {
        const jsonData = await import(
          "./character-templates/EvolutionPulse/Proxy.json"
        );
        return this.makeFromJson(jsonData);
      },
      [CharacterTemplates.Blank]: async () => makeBlankCharacter(),
    };

    const newCharacter = await templateFunctions[type]();
    return {
      ...newCharacter,
      id: Id.generate(),
      name: "",
      group: undefined,
      template: type,
      lastUpdated: getUnix(),
    };
  },
  makeFromJson(jsonData: any): ICharacter {
    const newSheet = { ...jsonData };
    const migratedSheet = this.migrate(newSheet);
    return migratedSheet;
  },
  makeTemplate(props: {
    name: string;
    pages: Array<IPage>;
    template: CharacterTemplates;
  }): ICharacter {
    return {
      id: Id.generate(),
      version: CharacterFactory.latestVersion,
      name: props.name,
      group: undefined,
      template: props.template,
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
  duplicate(c: ICharacter): ICharacter {
    return {
      ...c,
      id: Id.generate(),
      lastUpdated: getUnix(),
      name: `${c?.name} Copy`,
    };
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
    };

    return blockDefault[type];
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
      draft.sections.forEach((s) => {
        s.id = Id.generate();
        s.blocks.forEach((b) => {
          b.id = Id.generate();
        });
      });
    });
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
    template: CharacterTemplates.FateCondensed,
    playedDuringTurn: v2.playedDuringTurn,
    version: CharacterFactory.latestVersion,
  };
}
