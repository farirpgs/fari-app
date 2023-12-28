import { useTranslation, UseTranslationOptions } from "react-i18next";
import { ITranslationKeys } from "../../locale";

import { serverSideTranslations } from "../../../app/i18n";
import {
  IPossibleLanguages,
  PossibleLanguages,
} from "../../contexts/AppI18nContext/AppI18nContext";

export function useTranslate() {
  const { t, i18n } = useTranslation();

  const currentLanguage = getCurrentLanguage();

  return {
    currentLanguage,
    t: (
      key: ITranslationKeys,
      options?: UseTranslationOptions<""> & Record<string, string>,
      noFallback: boolean = false,
    ): string => {
      if (currentLanguage === "en") {
        return serverSideTranslations(key);
      }

      const value = t(key, options);
      const englishValue = i18n.t(key, {
        ...options,
        lng: "en",
      });
      const devValue = i18n.t(key, {
        ...options,
        lng: "dev",
      });

      const isValidValue = !!value && key !== value;
      if (!isValidValue) {
        if (noFallback) {
          return "";
        }

        return englishValue || devValue;
      }

      return value;
    },
    i18n,
  };

  function getCurrentLanguage() {
    if (!i18n.language) {
      return "en";
    }
    const [sanitizedLanguage] = i18n.language.split("-");

    return PossibleLanguages.includes(i18n.language as IPossibleLanguages)
      ? (i18n.language as IPossibleLanguages)
      : (sanitizedLanguage as IPossibleLanguages);
  }
}
