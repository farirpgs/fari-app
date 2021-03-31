import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import deTranslation from "../../../locales/de.json";
import enTranslation from "../../../locales/en.json";
import esTranslation from "../../../locales/es.json";
import frTranslation from "../../../locales/fr.json";
import glTranslation from "../../../locales/gl_ES.json";
import itTranslation from "../../../locales/it.json";
import ptbrTranslation from "../../../locales/pt_BR.json";
import ruTranslation from "../../../locales/ru.json";
import { ILogger } from "../logger/makeLogger";
import { devTranslation } from "./locales/devTranslations";

export const PossibleLanguages = [
  "en",
  "es",
  "pt-BR",
  "fr",
  "gl",
  "ru",
  "de",
  "it",
  "dev",
] as const;

export type IPossibleLanguages = typeof PossibleLanguages[number];

export async function InternationalizationService(logger: ILogger) {
  const i18n = i18next;

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        "en": {
          translation: enTranslation,
        },
        "es": {
          translation: esTranslation,
        },
        "fr": {
          translation: frTranslation,
        },
        "de": {
          translation: deTranslation,
        },
        "pt-BR": {
          translation: ptbrTranslation,
        },
        "ru": {
          translation: ruTranslation,
        },
        "it": {
          translation: itTranslation,
        },
        "gl": {
          translation: glTranslation,
        },
        "dev": {
          translation: devTranslation,
        },
      },
      supportedLngs: [...PossibleLanguages],
      fallbackLng: "en",
      debug: false,
      keySeparator: false,
      interpolation: {
        escapeValue: false,
      },
    });
  logger.setTag("language", i18n.language);
  logger.info(`I18n:onDetect:${i18n.language}`, {
    language: i18n.language,
    languages: i18n.languages,
  });
}
