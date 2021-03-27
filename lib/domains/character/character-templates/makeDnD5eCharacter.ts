import { Id } from "../../Id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { CharacterTemplates } from "../CharacterType";
import { BlockType, ICharacter, Position } from "../types";

export function makeDnD5eCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    template: CharacterTemplates.Dnd5e,
    pages: [
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Character",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                label: "Race",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Class",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Background",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Alignment",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Level",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Experience",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "INSPIRATION",
                type: BlockType.SlotTracker,
                meta: {},
                value: [{ label: "", checked: false }],
              },
              {
                id: Id.generate(),
                label: "Proficiencies & Languages:",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Equipment",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                label: "Platinum",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Gold",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Electrum",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Silver",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Copper",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Weight Carried",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Encumbered",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Push / Drag / Lift",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Equipment",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Health & Combat",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                label: "Armor Class",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Initiative",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                  checked: false,
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Hit Points",
                type: BlockType.PointCounter,
                meta: {
                  isMainPointCounter: false,
                  max: "1",
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Temporary Hit Points",
                type: BlockType.PointCounter,
                meta: {
                  isMainPointCounter: false,
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Hit Dice",
                type: BlockType.PointCounter,
                meta: {
                  isMainPointCounter: false,
                  max: "1",
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Death Save Success",
                type: BlockType.SlotTracker,
                meta: {},
                value: [
                  { label: "1", checked: false },
                  { label: "2", checked: false },
                  { label: "3", checked: false },
                ],
              },
              {
                id: Id.generate(),
                label: "Death Save Fail",
                type: BlockType.SlotTracker,
                meta: {},
                value: [
                  { label: "1", checked: false },
                  { label: "2", checked: false },
                  { label: "3", checked: false },
                ],
              },
              {
                id: Id.generate(),
                label: "Defenses",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
        ],
        label: "Character",
      },
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Saving Throws",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                label: "Strength",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Dexterity",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Constitution",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Intelligence",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Wisdom",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Charisma",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Saving Throw Modifiers",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Abilities",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                label: "Strength",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Dexterity",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Constitution",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Intelligence",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Wisdom",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Charisma",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Perception",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Insight",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Investigation",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Other Ability Notes",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Actions",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                label: "Action",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Bonus Action",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Reaction",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Special",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                label: "Acrobatics",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Animal Handling",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Athletics",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Deception",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "History",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Insight",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Intimidation",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Investigation",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Medicine",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Nature",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Perception",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Performance",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Persuasion",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Religion",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Sleight Of Hand:",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Stealth",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Survival",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d20"],
                },
                value: "0",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Spells",
            position: Position.Right,
            blocks: [],
          },
        ],
        label: "Actions",
      },
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "CLASS FEATURES",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                label: "<br>",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "TRAITS",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                label: "",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
        ],
        label: "Features and traits",
      },
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Background",
            position: Position.Left,
            blocks: [
              {
                id: Id.generate(),
                label: "Age",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Height",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Weight",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Eyes",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Skin",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Hair",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Personality Traits",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Ideals",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Bonds",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Flaws",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Backstory",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Allies & Organizations:",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
            visibleOnCard: false,
          },
          {
            id: Id.generate(),
            label: "Notes",
            position: Position.Right,
            blocks: [
              {
                id: Id.generate(),
                label: "",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
            ],
          },
        ],
        label: "Description",
      },
    ],
  });
}
