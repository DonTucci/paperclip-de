import type { TOptions } from "i18next";
import { i18n } from "./index";
import en from "./fork/en.json";

export type ForkMessageKey = keyof typeof en;

export function tf(key: ForkMessageKey, options: TOptions = {}): string {
  return String(i18n.t(key, {
    ...options,
    ns: "fork",
    keySeparator: false,
    defaultValue: en[key],
  }));
}

export function statusLabel(status: string, fallback: string): string {
  if (!i18n.language.startsWith("de")) return fallback;
  const key = `status.${status}`;
  return Object.hasOwn(en, key) ? tf(key as ForkMessageKey) : fallback;
}

export function getUiLocale(): "de-DE" | "de-AT" | "de-CH" | "en-US" {
  if (i18n.language === "de-DE" || i18n.language === "de-AT" || i18n.language === "de-CH") return i18n.language;
  return i18n.language.startsWith("de") ? "de-CH" : "en-US";
}

export function formatUiNumber(value: number): string {
  return new Intl.NumberFormat(getUiLocale()).format(value);
}
