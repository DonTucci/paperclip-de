export const LANGUAGE_STORAGE_KEY = "paperclip.ui.language";
export type ForkLanguage = "de-DE" | "de-AT" | "de-CH" | "en";

export function readLanguage(): ForkLanguage {
  try {
    const saved = globalThis.localStorage?.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "en" || saved === "de-DE" || saved === "de-AT" || saved === "de-CH" ? saved : "de-CH";
  } catch {
    return "de";
  }
}

export function saveLanguage(language: ForkLanguage): void {
  globalThis.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}
