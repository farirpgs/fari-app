import { Id } from "../../Id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { CharacterTemplates } from "../CharacterType";
import { ICharacter } from "../types";

export function makeBlankCharacter(): ICharacter {
  return CharacterFactory.makeTemplate({
    name: "",
    template: CharacterTemplates.Blank,
    pages: [
      {
        id: Id.generate(),
        label: "Character",
        sections: [],
      },
    ],
  });
}
