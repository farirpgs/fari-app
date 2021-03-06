import { Id } from "../../id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { BlockType, ICharacter } from "../types";

export function makeTheWitchIsDeadCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    pages: [
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Character",
            position: 0,
            blocks: [
              {
                id: Id.generate(),
                label: "NAme",
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
                label: "MAgie spell you know",
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
            position: 1,
            blocks: [
              {
                id: Id.generate(),
                label: "Clever",
                type: BlockType.Skill,
                meta: {},
                value: "0",
              },
              {
                id: Id.generate(),
                label: "FIERCE",
                type: BlockType.Skill,
                meta: {},
                value: "0",
              },
              {
                id: Id.generate(),
                label: "SLY",
                type: BlockType.Skill,
                meta: {},
                value: "0",
              },
              {
                id: Id.generate(),
                label: "QUICK",
                type: BlockType.Skill,
                meta: {},
                value: "0",
              },
              {
                id: Id.generate(),
                label: "CURRENT DANGER",
                type: BlockType.PointCounter,
                meta: {
                  isMainPointCounter: false,
                },
                value: "0",
              },
            ],
          },
        ],
        label: "Character Sheet",
      },
    ],
  });
}
