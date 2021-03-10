import { Id } from "../../id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { BlockType, ICharacter, Position } from "../types";

export function makeTheWitchIsDeadCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    pages: [
      {
        id: Id.generate(),
        label: "Character",
        sections: [
          {
            id: Id.generate(),
            label: "Character",
            position: Position.Left,
            visibleOnCard: true,
            blocks: [
              {
                id: Id.generate(),
                label: "Name",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Species",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Magic spell you know",
                type: BlockType.Text,
                meta: {},
                value: "",
              },
              {
                id: Id.generate(),
                label: "Notes, Revenge Plans, Vitriol",
                type: BlockType.Text,
                meta: {},
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
                label: "Clever",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d10"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Fierce",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d10"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Sly",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d10"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Quick",
                type: BlockType.Skill,
                meta: {
                  commands: ["1d10"],
                },
                value: "0",
              },
              {
                id: Id.generate(),
                label: "Current Danger",
                type: BlockType.PointCounter,
                meta: {
                  isMainPointCounter: false,
                },
                value: "0",
              },
            ],
          },
        ],
      },
    ],
  });
}
