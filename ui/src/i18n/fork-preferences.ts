export const LANGUAGE_STORAGE_KEY = "paperclip.ui.language";
export type ForkLanguage = "de" | "en";

export function readLanguage(): ForkLanguage {
  try {
    return globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "de";
  } catch {
    return "de";
  }
}

export function saveLanguage(language: ForkLanguage): void {
  globalThis.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}
