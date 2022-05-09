import { ICharacterTemplate } from "./CharacterType";

export const DefaultTemplates = {
  BlankTemplate: {
    category: "Default",
    fileName: "Blank",
    importFunction: async () =>
      import("./character-templates/Defaults/Blank.json"),
  } as ICharacterTemplate,
  FateCondensed: {
    category: "Default",
    fileName: "FateCondensed",
    importFunction: async () =>
      import("./character-templates/Fate Condensed/Fate Condensed.json"),
  } as ICharacterTemplate,
  FateAccelerated: {
    category: "Default",
    fileName: "FateAccelerated",
    importFunction: async () =>
      import("./character-templates/Fate Accelerated/Fate Accelerated.json"),
  } as ICharacterTemplate,
} as const;
