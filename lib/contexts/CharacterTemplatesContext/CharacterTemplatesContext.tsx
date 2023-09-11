"use client";
import { createContext } from "react";
import { ICharacterTemplate } from "../../services/character-templates/CharacterTemplateService";

export const CharacterTemplatesContext = createContext<{
  templates: Array<ICharacterTemplate>;
}>(undefined as any);

export const CharacterTemplatesProvider = CharacterTemplatesContext.Provider;
