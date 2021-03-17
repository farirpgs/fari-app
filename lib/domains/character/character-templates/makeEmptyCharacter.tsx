import { Id } from "../../Id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { CharacterType } from "../CharacterType";
import { ICharacter } from "../types";

export function makeEmptyCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    template: CharacterType.Blank,
    pages: [
      {
        id: Id.generate(),
        label: "Character",
        sections: [],
      },
    ],
  });
}
