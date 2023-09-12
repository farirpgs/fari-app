export const DefaultTemplates = {
  BlankTemplate: await import(
    "../../../public/character-templates/Defaults/Blank.json"
  ),
  FateCondensed: await import(
    "../../../public/character-templates/Fate Condensed/Fate Condensed.json"
  ),
} as const;
