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
  if (i18n.language !== "de") return fallback;
  const key = `status.${status}`;
  return Object.hasOwn(en, key) ? tf(key as ForkMessageKey) : fallback;
}

export function getUiLocale(): "de-CH" | "en-US" {
  return i18n.language === "de" ? "de-CH" : "en-US";
}

export function formatUiNumber(value: number): string {
  return new Intl.NumberFormat(getUiLocale()).format(value);
}
