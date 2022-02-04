import { ICharacterTemplate } from "./CharacterType";

export const DefaultTemplates = {
  BlankTemplate: {
    category: "Default",
    fileName: "Blank",
    importFunction: async () =>
      import("./character-templates/Default/Blank.json"),
  } as ICharacterTemplate,
  FateCondensed: {
    category: "Default",
    fileName: "FateCondensed",
    importFunction: async () =>
      import("./character-templates/Default/Blank.json"),
  } as ICharacterTemplate,
  FateAccelerated: {
    category: "Default",
    fileName: "FateAccelerated",
    importFunction: async () =>
      import("./character-templates/Default/Blank.json"),
  } as ICharacterTemplate,
} as const;
