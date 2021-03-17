import { useTranslation, UseTranslationOptions } from "react-i18next";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import { ITranslationKeys } from "../../locale";
import {
  IPossibleLanguages,
  PossibleLanguages,
} from "../../services/internationalization/InternationalizationService";

export function useTranslate() {
  const { t, i18n } = useTranslation();
  const logger = useLogger();
  const currentLanguage = getCurrentLanguage();

  return {
    currentLanguage,
    t: (
      key: ITranslationKeys,
      options?: UseTranslationOptions & Record<string, string>
    ): string => {
      const value = t(key, options);
      const englishValue = i18n.t(key, {
        ...options,
        lng: "en",
      });
      const devValue = i18n.t(key, {
        ...options,
        lng: "dev",
      });

      if (!value) {
        logger.warn("useTranslate:onMissingTranslation", {
          key,
          currentLanguage,
        });

        return englishValue || devValue;
      }
      return value;
    },
    i18n,
  };

  function getCurrentLanguage() {
    const [sanitizedLanguage] = i18n.language.split("-");

    return PossibleLanguages.includes(i18n.language as IPossibleLanguages)
      ? (i18n.language as IPossibleLanguages)
      : (sanitizedLanguage as IPossibleLanguages);
  }
}
