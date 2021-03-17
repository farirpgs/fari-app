import { useTranslation, UseTranslationOptions } from "react-i18next";
import { useLogger } from "../../contexts/InjectionsContext/hooks/useLogger";
import {
  IPossibleLanguages,
  PossibleLanguages,
} from "../../services/internationalization/InternationalizationService";
import { IPossibleTranslationsKeys } from "../../types/locale";

export function useTranslate() {
  const { t, i18n } = useTranslation();
  const logger = useLogger();
  const currentLanguage = getCurrentLanguage();

  return {
    currentLanguage,
    t: (
      key: IPossibleTranslationsKeys,
      options?: UseTranslationOptions & Record<string, string>
    ): string => {
      const value = t(key, options);
      const valueWithoutFallback = i18n.t(key, {
        ...options,
        fallbackLng: "dev",
      });
      if (valueWithoutFallback === key) {
        logger.warn("useTranslate:onMissingTranslation", {
          key,
          currentLanguage,
        });
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
