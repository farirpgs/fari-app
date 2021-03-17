export enum CharacterType {
  FateCondensed = "FateCondensed",
  FateCore = "FateCore",
  FateAccelerated = "FateAccelerated",
  FateOfCthulhu = "FateOfCthulhu",
  Dnd5e = "Dnd5e",
  TheWitchIsDead = "TheWitchIsDead",
  Blank = "Blank",
}

export const CharacterSheetTypes: Array<{
  type: CharacterType;
  group: string;
}> = [
  { group: "Fate", type: CharacterType.FateCondensed },
  { group: "Fate", type: CharacterType.FateCore },
  { group: "Fate", type: CharacterType.FateAccelerated },
  { group: "Fate", type: CharacterType.FateOfCthulhu },
  { group: "Dungeons & Dragons", type: CharacterType.Dnd5e },
  { group: "Grant Howitt", type: CharacterType.TheWitchIsDead },
  { group: "Blank", type: CharacterType.Blank },
];

export const CharacterSheetTypesInformation: Record<
  CharacterType,
  { author?: { name: string; link: string } }
> = {
  [CharacterType.FateCondensed]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterType.FateCore]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterType.FateAccelerated]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterType.FateOfCthulhu]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterType.Dnd5e]: {},
  [CharacterType.TheWitchIsDead]: {
    author: { name: "Grant Howitt", link: "https://rowanrookanddecard.com/" },
  },
  [CharacterType.Blank]: {},
};
