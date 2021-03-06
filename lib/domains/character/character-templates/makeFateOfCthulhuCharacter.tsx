import { Id } from "../../id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { BlockType, ICharacter } from "../types";

export function makeFateOfCthulhuCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    pages: [
      {
        id: Id.generate(),
        label: "Character",
        sections: [
          {
            id: Id.generate(),
            label: "Aspects",
            visibleOnCard: true,
            position: 0,
            blocks: [
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: false },
                label: "High Concept",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: false },
                label: "Trouble",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: false },
                label: "Relationship",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: false },
                label: "Other Aspect",
                value: "",
              },
              {
                id: Id.generate(),
                type: BlockType.Text,
                meta: { checked: false },
                label: "Other Aspect",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",
            position: 0,
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
            position: 0,
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
            position: 0,
            blocks: [
              {
                id: Id.generate(),
                meta: { isMainPointCounter: false },
                type: BlockType.PointCounter,
                label: "Fate Points",
                value: "",
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Stress",
            position: 1,
            blocks: [
              {
                id: Id.generate(),
                label: "Physical",
                meta: {},
                type: BlockType.SlotTracker,
                value: [
                  { checked: false, label: "1" },
                  { checked: false, label: "2" },
                  { checked: false, label: "3" },
                ],
              },
              {
                id: Id.generate(),
                label: "Mental",
                meta: {},
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
            position: 1,
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
            position: 1,
            blocks: [
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Academics",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Athletics",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Burglary",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Contacts",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Crafts",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Deceive",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Drive",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Empathy",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Fight",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Investigate",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Lore",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Notice",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Physique",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Provoke",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Rapport",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Resources",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Shoot",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
                type: BlockType.Skill,
                label: "Stealth",
                value: "",
              },
              {
                id: Id.generate(),
                meta: {},
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
