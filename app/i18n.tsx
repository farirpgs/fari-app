import englishTranslations from "../public/locales/en/translation.json";

export function t(key: string) {
  return (englishTranslations as any)[key];
}
