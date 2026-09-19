const storageEntries = new Map<string, string>();
// Bestehende Upstream-Tests prüfen englische Texte. Deutsche Ansichten haben eigene Tests.
storageEntries.set("paperclip.ui.language", "en");

function installStorageMock(target: Record<string, unknown>) {
  Object.defineProperty(target, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storageEntries.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storageEntries.set(key, String(value));
      },
      removeItem: (key: string) => {
        storageEntries.delete(key);
      },
      clear: () => {
        storageEntries.clear();
      },
    },
  });
}

if (
  typeof globalThis.localStorage?.getItem !== "function"
  || typeof globalThis.localStorage?.setItem !== "function"
  || typeof globalThis.localStorage?.removeItem !== "function"
  || typeof globalThis.localStorage?.clear !== "function"
) {
  installStorageMock(globalThis);
}

if (typeof window !== "undefined" && window.localStorage !== globalThis.localStorage) {
  installStorageMock(window as unknown as Record<string, unknown>);
}

// jsdom does not implement Element.prototype.scrollIntoView. Several surfaces
// (e.g. IssueChatThread's auto-scroll-to-latest) call it during normal render,
// so provide a no-op default. Tests that assert on scroll behaviour override
// this on the prototype themselves and restore it afterwards.
if (typeof Element !== "undefined" && typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

globalThis.localStorage.setItem("paperclip.ui.language", "en");
