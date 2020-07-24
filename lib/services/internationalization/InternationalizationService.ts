import i18next, { i18n } from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { devTranslation } from "./locales/devTranslation";
import { enTranslation } from "./locales/enTranslation";
import { esTranslation } from "./locales/esTranslation";

export type IPossibleLanguages = "en" | "es" | "dev";

export class InternationalizationService {
  public i18next: i18n;

  constructor() {
    this.i18next = i18next;
    this.init();
  }

  private async init() {
    await i18next
      .use(detector)
      .use(initReactI18next)
      .init({
        resources: {
          en: {
            translation: enTranslation,
          },
          es: {
            translation: esTranslation,
          },
          dev: {
            translation: devTranslation,
          },
        },
        lng: "en",
        fallbackLng: "en",
        debug: false,
        keySeparator: false,
        interpolation: {
          escapeValue: false,
        },
      });
  }
}
