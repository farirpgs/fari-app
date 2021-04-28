export enum CharacterTemplates {
  FateCondensed = "FateCondensed",
  FateCore = "FateCore",
  FateAccelerated = "FateAccelerated",
  FateOfCthulhu = "FateOfCthulhu",
  DresdenFilesAccelerated = "DresdenFilesAccelerated",
  VentureCity = "VentureCity",
  Heartbreaker = "Heartbreaker",
  IronEddaAccelerated = "IronEddaAccelerated",
  StrandsOfFate = "StrandsOfFate",
  EvolutionPulse_Hydrah = "EvolutionPulse_Hydrah",
  EvolutionPulse_Hyonos = "EvolutionPulse_Hyonos",
  EvolutionPulse_LostH = "EvolutionPulse_LostH",
  EvolutionPulse_Obscura = "EvolutionPulse_Obscura",
  EvolutionPulse_Proxy = "EvolutionPulse_Proxy",
  ThePool = "ThePool",
  TunnelsAndTrolls = "TunnelsAndTrolls",
  Maze = "Maze",
  Dnd5e = "Dnd5e",
  TheWitchIsDead = "TheWitchIsDead",
  EdgeOfTheEmpire = "EdgeOfTheEmpire",
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
  { group: "Fate", template: CharacterTemplates.StrandsOfFate },
  {
    group: "Evolution Pulse",
    template: CharacterTemplates.EvolutionPulse_Hydrah,
  },
  {
    group: "Evolution Pulse",
    template: CharacterTemplates.EvolutionPulse_Hyonos,
  },
  {
    group: "Evolution Pulse",
    template: CharacterTemplates.EvolutionPulse_LostH,
  },
  {
    group: "Evolution Pulse",
    template: CharacterTemplates.EvolutionPulse_Obscura,
  },
  {
    group: "Evolution Pulse",
    template: CharacterTemplates.EvolutionPulse_Proxy,
  },
  { group: "Maze", template: CharacterTemplates.Maze },
  { group: "Tunnels & Trolls", template: CharacterTemplates.TunnelsAndTrolls },
  { group: "The Pool", template: CharacterTemplates.ThePool },
  { group: "Dungeons & Dragons", template: CharacterTemplates.Dnd5e },
  { group: "Grant Howitt", template: CharacterTemplates.TheWitchIsDead },
  { group: "Star Wars", template: CharacterTemplates.EdgeOfTheEmpire },
  { group: "Blank", template: CharacterTemplates.Blank },
];

type ITemplateInfo = {
  isFate?: boolean;
  author?: {
    name: string;
    link: string;
  };
};

export const CharacterTemplatesInformation: {
  [template in CharacterTemplates]?: ITemplateInfo;
} = {
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
  [CharacterTemplates.TheWitchIsDead]: {
    author: { name: "Grant Howitt", link: "https://rowanrookanddecard.com/" },
  },
  [CharacterTemplates.EdgeOfTheEmpire]: {
    author: {
      name: "Fantasy Flight",
      link:
        "https://www.fantasyflightgames.com/en/products/star-wars-edge-of-the-empire/",
    },
  },
  [CharacterTemplates.EvolutionPulse_Hydrah]: {
    author: {
      name: "Dreamlord Press",
      link: "https://www.dreamlord.it/en/dreamlord/",
    },
  },
  [CharacterTemplates.EvolutionPulse_Hyonos]: {
    author: {
      name: "Dreamlord Press",
      link: "https://www.dreamlord.it/en/dreamlord/",
    },
  },
  [CharacterTemplates.EvolutionPulse_LostH]: {
    author: {
      name: "Dreamlord Press",
      link: "https://www.dreamlord.it/en/dreamlord/",
    },
  },
  [CharacterTemplates.EvolutionPulse_Obscura]: {
    author: {
      name: "Dreamlord Press",
      link: "https://www.dreamlord.it/en/dreamlord/",
    },
  },
  [CharacterTemplates.EvolutionPulse_Proxy]: {
    author: {
      name: "Dreamlord Press",
      link: "https://www.dreamlord.it/en/dreamlord/",
    },
  },
};

export function getTemplateInfo(
  template: CharacterTemplates | undefined
): ITemplateInfo | undefined {
  return CharacterTemplatesInformation[template as CharacterTemplates];
}
