import { useTranslation, UseTranslationOptions } from "react-i18next";
import {
  IPossibleLanguages,
  PossibleLanguages,
} from "../../services/internationalization/InternationalizationService";
import { IPossibleTranslationKeys } from "../../services/internationalization/IPossibleTranslationKeys";

export function useTranslate() {
  const { t, i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  return {
    currentLanguage,
    t: t as (
      key: IPossibleTranslationKeys,
      options?: UseTranslationOptions & Record<string, string>
    ) => string,
    i18n,
  };

  function getCurrentLanguage() {
    const [sanitizedLanguage] = i18n.language.split("-");

    return PossibleLanguages.includes(i18n.language as IPossibleLanguages)
      ? (i18n.language as IPossibleLanguages)
      : (sanitizedLanguage as IPossibleLanguages);
  }
}
