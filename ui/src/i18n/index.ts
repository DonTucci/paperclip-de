import i18n, { type InitOptions, type TOptions } from "i18next";
import { initReactI18next, useTranslation as useReactI18nextTranslation } from "react-i18next";

import { DEFAULT_LOCALE, i18nextResources, supportedLocales } from "./locales";
import { readLanguage } from "./fork-preferences";
import forkEnglish from "./fork/en.json";
import forkGerman from "./fork/de.json";

const resources = {
  ...i18nextResources,
  en: { ...i18nextResources.en, fork: forkEnglish },
  de: { ...i18nextResources.de, fork: forkGerman },
};

const i18nextOptions: InitOptions = {
  resources,
  lng: readLanguage(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: supportedLocales,
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnObjects: false,
  initAsync: false,
};

void i18n.use(initReactI18next).init(i18nextOptions).catch((error: unknown) => {
  console.error("Failed to initialize i18next", error);
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language === "de" ? "de-CH" : "en";
}

export function t(key: string, options: TOptions = {}) {
  return i18n.t(key, options);
}

export const useTranslation = useReactI18nextTranslation;
export { i18n };
