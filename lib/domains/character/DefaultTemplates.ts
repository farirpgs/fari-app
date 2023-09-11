import { ICharacterTemplate } from "../../services/character-templates/CharacterTemplateService";

export const DefaultTemplates = {
  BlankTemplate: {
    publisher: "Default",
    name: "Blank",
    fetchPath: "/public/character-templates/Blank/Blank.json",
  } as ICharacterTemplate,
  FateCondensed: {
    publisher: "Default",
    name: "FateCondensed",
    fetchPath: "/public/character-templates/Fate Condensed/Fate Condensed.json",
    FateAccelerated: {
      publisher: "Default",
      name: "FateAccelerated",
      fetchPath:
        "/public/character-templates/Fate Accelerated/Fate Accelerated.json",
    } as ICharacterTemplate,
  },
} as const;
