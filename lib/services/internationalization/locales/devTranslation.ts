import { IPossibleTranslationKeys } from "../IPossibleTranslationKeys";
import { enTranslation } from "./enTranslation";

export const devTranslation = Object.keys(enTranslation).reduce((acc, curr) => {
  return {
    ...acc,
    [curr]: curr,
  };
}, {} as Record<IPossibleTranslationKeys, string>);
