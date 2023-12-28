"use client";
import i18next from "i18next";
import I18nLanguageDetector from "i18next-browser-languagedetector";
import I18nHttpApi from "i18next-http-backend";
import { createContext } from "react";
import { initReactI18next } from "react-i18next";

export const PossibleLanguages = [
  "en",
  "es",
  "eo",
  "pt-BR",
  "zh_CN",
  "zh_TW",
  "fr",
  "gl",
  "ru",
  "de",
  "it",
  "pl",
  "tr",
  "dev",
] as const;

export type IPossibleLanguages = (typeof PossibleLanguages)[number];

export const PossibleLanguagesNames: Record<IPossibleLanguages, string> = {
  "en": "English",
  "es": "Español",
  "eo": "Esperanto",
  "pt-BR": "Português Brasileiro",
  "zh_CN": "简体中文",
  "zh_TW": "臺灣國語",
  "fr": "Français",
  "gl": "Galego",
  "ru": "Русский",
  "de": "Deutsch",
  "it": "Italiano",
  "pl": "Polski",
  "tr": "Türk",
  "dev": "Development",
};

const i18n = i18next;
if (typeof window !== "undefined") {
  loadI18n();
  async function loadI18n() {
    await i18n
      .use(I18nLanguageDetector)
      .use(initReactI18next)
      .use(I18nHttpApi)
      .init({
        supportedLngs: [...PossibleLanguages],
        fallbackLng: "en",
        debug: false,
        keySeparator: false,
        interpolation: {
          escapeValue: false,
        },
      });
  }
}
function useAppI18n() {
  return {};
}

export const AppI18nContext = createContext<ReturnType<typeof useAppI18n>>(
  undefined as any,
);

export function AppI18nProvider(props: { children: React.ReactNode }) {
  const contextValue = useAppI18n();

  return (
    <AppI18nContext.Provider value={contextValue}>
      {props.children}
    </AppI18nContext.Provider>
  );
}
