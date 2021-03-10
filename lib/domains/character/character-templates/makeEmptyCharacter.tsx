import { Id } from "../../Id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { ICharacter } from "../types";

export function makeEmptyCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    pages: [
      {
        id: Id.generate(),
        label: "Character",
        sections: [],
      },
    ],
  });
}
