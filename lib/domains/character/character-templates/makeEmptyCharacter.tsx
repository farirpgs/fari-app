import { getUnix } from "../../dayjs/getDayJS";
import { Id } from "../../id/Id";
import { CharacterFactory } from "../CharacterFactory";
import { ICharacter } from "../types";

export function makeEmptyCharacter(): ICharacter {
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
        sections: [],
      },
    ],
  };
}
