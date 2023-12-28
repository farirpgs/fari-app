"use client";

import { createContext } from "react";
import { ICharacterTemplate } from "../../services/character-templates/ICharacterTemplate";

export const CharacterTemplatesContext = createContext<{
  templates: Array<ICharacterTemplate>;
}>(undefined as any);

export function CharacterTemplatesProvider(props: {
  children: React.ReactNode;
  value: {
    templates: Array<ICharacterTemplate>;
  };
}) {
  return (
    <CharacterTemplatesContext.Provider value={props.value}>
      {props.children}
    </CharacterTemplatesContext.Provider>
  );
}
