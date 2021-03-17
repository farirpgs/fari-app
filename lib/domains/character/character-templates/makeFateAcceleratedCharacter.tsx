import { Id } from "../../Id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { CharacterType } from "../CharacterType";
import { BlockType, ICharacter, Position } from "../types";

export function makeFateAcceleratedCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    template: CharacterType.FateAccelerated,
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
                meta: {},
                label: "Stunt #1",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {},
                label: "Stunt #2",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: {},
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
                meta: {},
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
                type: BlockType.SlotTracker,
                meta: {},
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
                type: BlockType.Skill,
                meta: { commands: ["4dF"] },
                label: "Careful",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { commands: ["4dF"] },
                label: "Clever",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { commands: ["4dF"] },
                label: "Forceful",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { commands: ["4dF"] },
                label: "Flashy",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { commands: ["4dF"] },
                label: "Quick",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { commands: ["4dF"] },
                label: "Sneaky",
                value: "",
              },
            ],
          },
        ],
      },
    ],
  });
}
