import enTranslation from "../../../../locales/en.json";
import { ITranslationKeys } from "../../../locale";

export const devTranslation = Object.keys(enTranslation ?? {}).reduce(
  (acc, curr) => {
    return {
      ...acc,
      [curr]: `{.${curr}.}`,
    };
  },
  {} as Record<ITranslationKeys, string>
);
