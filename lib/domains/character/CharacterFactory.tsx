import { ICharacter } from "../../contexts/CharactersContext/CharactersContext";
import { getUnix } from "../dayjs/getDayJS";
import { Id } from "../id/Id";
import { CharacterType } from "./CharacterType";

export enum SectionType {
  Text,
  Number,
  // BigNumber,
  Checkboxes,
}

export enum Position {
  Left,
  Right,
}
function makeCondensedCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    pages: [
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Aspects",
            visibleOnCard: true,
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "High Concept", value: "" },
              { id: Id.generate(), label: "Trouble", value: "" },
              { id: Id.generate(), label: "Relationship", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "Stunt #1", value: "" },
              { id: Id.generate(), label: "Stunt #2", value: "" },
              { id: Id.generate(), label: "Stunt #3", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Other",
            type: SectionType.Text,
            position: Position.Left,
            fields: [{ id: Id.generate(), label: "Notes", value: "" }],
          },
          {
            id: Id.generate(),
            label: "Stress",
            type: SectionType.Checkboxes,
            position: Position.Right,
            fields: [
              {
                id: Id.generate(),
                label: "Physical",
                value: [
                  { checked: false, id: Id.generate(), label: "1" },
                  { checked: false, id: Id.generate(), label: "2" },
                  { checked: false, id: Id.generate(), label: "3" },
                ],
              },
              {
                id: Id.generate(),
                label: "Mental",
                value: [
                  { checked: false, id: Id.generate(), label: "1" },
                  { checked: false, id: Id.generate(), label: "2" },
                  { checked: false, id: Id.generate(), label: "3" },
                ],
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Consequences",
            type: SectionType.Text,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Mild", value: "" },
              { id: Id.generate(), label: "Moderate", value: "" },
              { id: Id.generate(), label: "Severe", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            visibleOnCard: true,
            type: SectionType.Number,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Academics", value: "" },
              { id: Id.generate(), label: "Athletics", value: "" },
              { id: Id.generate(), label: "Burglary", value: "" },
              { id: Id.generate(), label: "Contacts", value: "" },
              { id: Id.generate(), label: "Crafts", value: "" },
              { id: Id.generate(), label: "Deceive", value: "" },
              { id: Id.generate(), label: "Drive", value: "" },
              { id: Id.generate(), label: "Empathy", value: "" },
              { id: Id.generate(), label: "Fight", value: "" },
              { id: Id.generate(), label: "Investigate", value: "" },
              { id: Id.generate(), label: "Lore", value: "" },
              { id: Id.generate(), label: "Notice", value: "" },
              { id: Id.generate(), label: "Physique", value: "" },
              { id: Id.generate(), label: "Provoke", value: "" },
              { id: Id.generate(), label: "Rapport", value: "" },
              { id: Id.generate(), label: "Resources", value: "" },
              { id: Id.generate(), label: "Shoot", value: "" },
              { id: Id.generate(), label: "Stealth", value: "" },
              { id: Id.generate(), label: "Will", value: "" },
            ],
          },
        ],
      },
    ],
    refresh: 3,
    fatePoints: undefined,
    playedDuringTurn: undefined,

    lastUpdated: getUnix(),
  };
}
function makeAcceleratedCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    pages: [
      {
        id: Id.generate(),
        sections: [
          {
            id: Id.generate(),
            label: "Aspects",
            visibleOnCard: true,
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "High Concept", value: "" },
              { id: Id.generate(), label: "Trouble", value: "" },
              { id: Id.generate(), label: "Relationship", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
              { id: Id.generate(), label: "Other Aspect", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Stunts & Extras",
            type: SectionType.Text,
            position: Position.Left,
            fields: [
              { id: Id.generate(), label: "Stunt #1", value: "" },
              { id: Id.generate(), label: "Stunt #2", value: "" },
              { id: Id.generate(), label: "Stunt #3", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Other",
            type: SectionType.Text,
            position: Position.Left,
            fields: [{ id: Id.generate(), label: "Notes", value: "" }],
          },
          {
            id: Id.generate(),
            label: "Stress",
            type: SectionType.Checkboxes,
            position: Position.Right,
            fields: [
              {
                id: Id.generate(),
                label: "Stress",
                value: [
                  { checked: false, id: Id.generate(), label: "1" },
                  { checked: false, id: Id.generate(), label: "2" },
                  { checked: false, id: Id.generate(), label: "3" },
                ],
              },
            ],
          },
          {
            id: Id.generate(),
            label: "Consequences",
            type: SectionType.Text,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Mild", value: "" },
              { id: Id.generate(), label: "Moderate", value: "" },
              { id: Id.generate(), label: "Severe", value: "" },
            ],
          },
          {
            id: Id.generate(),
            label: "Skills",
            visibleOnCard: true,
            type: SectionType.Number,
            position: Position.Right,
            fields: [
              { id: Id.generate(), label: "Careful", value: "" },
              { id: Id.generate(), label: "Clever", value: "" },
              { id: Id.generate(), label: "Forceful", value: "" },
              { id: Id.generate(), label: "Flashy", value: "" },
              { id: Id.generate(), label: "Quick", value: "" },
              { id: Id.generate(), label: "Sneaky", value: "" },
            ],
          },
        ],
      },
    ],
    refresh: 3,
    fatePoints: undefined,
    playedDuringTurn: undefined,

    lastUpdated: getUnix(),
  };
}
function makeCustomCharacter(): ICharacter {
  return {
    id: "",
    version: CharacterFactory.latestVersion,
    name: "",
    group: undefined,
    pages: [
      {
        id: Id.generate(),
        sections: [],
      },
    ],
    refresh: 3,
    fatePoints: undefined,
    playedDuringTurn: undefined,

    lastUpdated: getUnix(),
  };
}

export const CharacterFactory = {
  latestVersion: 3,
  make(type: CharacterType): ICharacter {
    const newCharacter = {
      [CharacterType.CoreCondensed]: makeCondensedCharacter,
      [CharacterType.Accelerated]: makeAcceleratedCharacter,
      [CharacterType.Custom]: makeCustomCharacter,
    }[type]();

    return {
      ...newCharacter,
      id: Id.generate(),
      name: "",
      lastUpdated: getUnix(),
    };
  },
};
