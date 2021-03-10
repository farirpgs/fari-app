export enum CharacterType {
  CoreCondensed = "CoreCondensed",
  Accelerated = "Accelerated",
  FateOfCthulhu = "FateOfCthulhu",
  Dnd5e = "Dnd5e",
  TheWitchIsDead = "TheWitchIsDead",
  Blank = "Blank",
}

export const CharacterSheetTypes: Array<{
  type: CharacterType;
  group: string;
}> = [
  { group: "Fate", type: CharacterType.CoreCondensed },
  { group: "Fate", type: CharacterType.Accelerated },
  { group: "Fate", type: CharacterType.FateOfCthulhu },
  { group: "Dungeons & Dragons", type: CharacterType.Dnd5e },
  { group: "Grant Howitt", type: CharacterType.TheWitchIsDead },
  { group: "Blank", type: CharacterType.Blank },
];
