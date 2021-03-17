export enum CharacterTemplates {
  FateCondensed = "FateCondensed",
  FateCore = "FateCore",
  FateAccelerated = "FateAccelerated",
  FateOfCthulhu = "FateOfCthulhu",
  DresdenFilesAccelerated = "DresdenFilesAccelerated",
  Dnd5e = "Dnd5e",
  TheWitchIsDead = "TheWitchIsDead",
  Blank = "Blank",
}

export type ICharacterTemplateWithGroup = {
  template: CharacterTemplates;
  group: string;
};

export const CharacterTemplatesWithGroups: Array<ICharacterTemplateWithGroup> = [
  { group: "Fate", template: CharacterTemplates.FateCondensed },
  { group: "Fate", template: CharacterTemplates.FateCore },
  { group: "Fate", template: CharacterTemplates.FateAccelerated },
  { group: "Fate", template: CharacterTemplates.FateOfCthulhu },
  { group: "Fate", template: CharacterTemplates.DresdenFilesAccelerated },
  { group: "Dungeons & Dragons", template: CharacterTemplates.Dnd5e },
  { group: "Grant Howitt", template: CharacterTemplates.TheWitchIsDead },
  { group: "Blank", template: CharacterTemplates.Blank },
];

export const CharacterTemplatesInformation: Record<
  CharacterTemplates,
  { author?: { name: string; link: string } }
> = {
  [CharacterTemplates.FateCondensed]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.FateCore]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.FateAccelerated]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.FateOfCthulhu]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.DresdenFilesAccelerated]: {
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.Dnd5e]: {},
  [CharacterTemplates.TheWitchIsDead]: {
    author: { name: "Grant Howitt", link: "https://rowanrookanddecard.com/" },
  },
  [CharacterTemplates.Blank]: {},
};

export function getTemplateInfo(template: CharacterTemplates | undefined) {
  return CharacterTemplatesInformation[template as CharacterTemplates];
}
