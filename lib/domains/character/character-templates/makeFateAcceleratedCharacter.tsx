import { getUnix } from "../../dayjs/getDayJS";
import { Id } from "../../id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { BlockType, ICharacter, Position } from "../types";

export function makeFateAcceleratedCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    lastUpdated: getUnix(),
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
                meta: { checked: undefined },
                label: "High Concept",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
                label: "Trouble",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
                label: "Relationship",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
                label: "Other Aspect",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
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
                meta: { checked: undefined },
                label: "Mild",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
                label: "Moderate",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: undefined },
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
                meta: { checked: undefined },
                label: "Careful",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { checked: undefined },
                label: "Clever",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { checked: undefined },
                label: "Forceful",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { checked: undefined },
                label: "Flashy",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { checked: undefined },
                label: "Quick",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Skill,
                meta: { checked: undefined },
                label: "Sneaky",
                value: "",
              },
            ],
          },
        ],
      },
    ],
  };
}
