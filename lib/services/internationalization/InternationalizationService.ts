import i18next, { i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { ILogger } from "../logger/makeLogger";
import { deTranslation } from "./locales/deTranslation";
import { devTranslation } from "./locales/devTranslation";
import { enTranslation } from "./locales/enTranslation";
import { esTranslation } from "./locales/esTranslation";
import { frTranslation } from "./locales/frTranslation";
import { glTranslation } from "./locales/glTranslation";
import { itTranslation } from "./locales/itTranslation";
import { ptbrTranslation } from "./locales/ptbrTranslations";
import { ruTranslation } from "./locales/ruTranslation";

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

export class InternationalizationService {
  public i18next: i18n;

  constructor(private logger: ILogger) {
    this.i18next = i18next;
    this.init();
  }

  private async init() {
    await this.i18next
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
    this.logger.info(`I18n:onDetect:${this.i18next.language}`, {
      language: this.i18next.language,
      languages: this.i18next.languages,
    });
  }
}
