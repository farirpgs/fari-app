export enum CharacterTemplates {
  FateCondensed = "FateCondensed",
  FateCore = "FateCore",
  FateAccelerated = "FateAccelerated",
  FateOfCthulhu = "FateOfCthulhu",
  DresdenFilesAccelerated = "DresdenFilesAccelerated",
  VentureCity = "VentureCity",
  Heartbreaker = "Heartbreaker",
  IronEddaAccelerated = "IronEddaAccelerated",
  Maze = "Maze",
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
  { group: "Fate", template: CharacterTemplates.VentureCity },
  { group: "Fate", template: CharacterTemplates.Heartbreaker },
  { group: "Fate", template: CharacterTemplates.IronEddaAccelerated },
  { group: "Maze", template: CharacterTemplates.Maze },
  { group: "Dungeons & Dragons", template: CharacterTemplates.Dnd5e },
  { group: "Grant Howitt", template: CharacterTemplates.TheWitchIsDead },
  { group: "Blank", template: CharacterTemplates.Blank },
];

type ITemplateInfo = {
  isFate?: boolean;
  author?: {
    name: string;
    link: string;
  };
};

export const CharacterTemplatesInformation: Record<
  CharacterTemplates,
  ITemplateInfo
> = {
  [CharacterTemplates.FateCondensed]: {
    isFate: true,
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.FateCore]: {
    isFate: true,
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.FateAccelerated]: {
    isFate: true,
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.FateOfCthulhu]: {
    isFate: true,
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.DresdenFilesAccelerated]: {
    isFate: true,
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.VentureCity]: {
    isFate: true,
    author: {
      name: "Evil Hat Productions",
      link: "https://www.evilhat.com/home/",
    },
  },
  [CharacterTemplates.Heartbreaker]: {
    isFate: true,
    author: {
      name: "A.C. Luke",
      link: "https://ac-luke.itch.io/heartbreaker-trifold",
    },
  },
  [CharacterTemplates.IronEddaAccelerated]: {
    isFate: true,
    author: {
      name: "Exploding Rogue",
      link:
        "https://www.drivethrurpg.com/product/137962/Iron-Edda-War-of-Metal-and-Bone",
    },
  },
  [CharacterTemplates.Maze]: {
    author: {
      name: "9th Level Games",
      link: "https://www..com/product-page/mazes-zine-a-polymorph-adventure",
    },
  },
  [CharacterTemplates.Dnd5e]: {},
  [CharacterTemplates.TheWitchIsDead]: {
    author: { name: "Grant Howitt", link: "https://rowanrookanddecard.com/" },
  },
  [CharacterTemplates.Blank]: {},
};

export function getTemplateInfo(
  template: CharacterTemplates | undefined
): ITemplateInfo | undefined {
  return CharacterTemplatesInformation[template as CharacterTemplates];
}
