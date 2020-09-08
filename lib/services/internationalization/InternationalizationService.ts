import i18next, { i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { devTranslation } from "./locales/devTranslation";
import { enTranslation } from "./locales/enTranslation";
import { esTranslation } from "./locales/esTranslation";
import { frTranslation } from "./locales/frTranslation";
import { ptbrTranslation } from "./locales/ptbrTranslations";

export type IPossibleLanguages = "en" | "es" | "dev";

export class InternationalizationService {
  public i18next: i18n;

  constructor() {
    this.i18next = i18next;
    this.init();
  }

  private async init() {
    await i18next
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
          "pt-BR": {
            translation: ptbrTranslation,
          },
          "dev": {
            translation: devTranslation,
          },
        },
        fallbackLng: "en",
        debug: false,
        keySeparator: false,
        interpolation: {
          escapeValue: false,
        },
      });
  }
}
