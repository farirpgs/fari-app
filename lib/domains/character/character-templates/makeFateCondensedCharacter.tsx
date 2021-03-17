import { Id } from "../../Id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { CharacterTemplates } from "../CharacterType";
import { BlockType, ICharacter, Position } from "../types";

export function makeFateCondensedCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    template: CharacterTemplates.FateCondensed,
    pages: [
      {
        id: Id.generate(),
        label: "Character",
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
                meta: {},
                label: "High Concept",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {},
                label: "Trouble",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {},
                label: "Relationship",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {},
                label: "Other Aspect",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {},
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
                meta: { checked: undefined },
                label: "Stunt #1",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
                label: "Stunt #2",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
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
                meta: { checked: undefined },
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
                meta: { isMainPointCounter: true, max: "3" },
                type: BlockType.PointCounter,
                label: "Fate Points",
                value: "3",
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
                meta: {},
                type: BlockType.SlotTracker,
                value: [
                  { checked: false, label: "1" },
                  { checked: false, label: "1" },
                  { checked: false, label: "1" },
                ],
              },
              {
                id: Id.generate(),
                label: "Mental",
                meta: {},
                type: BlockType.SlotTracker,
                value: [
                  { checked: false, label: "1" },
                  { checked: false, label: "1" },
                  { checked: false, label: "1" },
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
                meta: {
                  checked: false,
                },
                label: "Mild",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {
                  checked: false,
                },
                label: "Moderate",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {
                  checked: false,
                },
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
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Academics",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Athletics",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Burglary",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Contacts",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Crafts",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Deceive",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Drive",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Empathy",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Fight",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Investigate",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Lore",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Notice",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Physique",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Provoke",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Rapport",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Resources",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Shoot",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Stealth",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {
                  commands: ["4dF"],
                },
                type: BlockType.Skill,
                label: "Will",
                value: "",
              },
            ],
          },
        ],
      },
    ],
  });
}
