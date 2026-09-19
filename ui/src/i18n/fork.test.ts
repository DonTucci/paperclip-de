import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { i18n } from "./index";
import { tf, statusLabel } from "./fork";
import { LANGUAGE_STORAGE_KEY, readLanguage } from "./fork-preferences";
import { IssueStatusBadge, AgentStatusBadge, StatusBadge } from "../components/StatusBadge";
import en from "./fork/en.json";
import de from "./fork/de.json";
import { validateLocaleMessages } from "./locale-validation";

afterEach(async () => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
  await i18n.changeLanguage("en");
});

describe("deutscher Fork", () => {
  it("verwendet Deutsch ohne gespeicherte Auswahl", () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    expect(readLanguage()).toBe("de");
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "invalid");
    expect(readLanguage()).toBe("de");
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
    expect(readLanguage()).toBe("en");
  });

  it("prüft den zusätzlichen Namespace gegen seine englische Referenz", () => {
    expect(validateLocaleMessages(de, en)).toEqual([]);
  });

  it("übersetzt Navigation und erhält englische Rückfalltexte", async () => {
    await i18n.changeLanguage("de");
    expect(tf("nav.newTask")).toBe("Neue Aufgabe");
    expect(tf("nav.dashboard")).toBe("Übersicht");
    await i18n.changeLanguage("en");
    expect(tf("nav.newTask")).toBe("New Task");
  });

  it("übersetzt interne Statuswerte ausschliesslich bei der Anzeige", async () => {
    await i18n.changeLanguage("de");
    expect(renderToStaticMarkup(createElement(IssueStatusBadge, { status: "in_review" }))).toContain("In Prüfung");
    expect(renderToStaticMarkup(createElement(AgentStatusBadge, { status: "active" }))).toContain("Bereit");
    expect(statusLabel("unknown_future_status", "Custom status")).toBe("Custom status");
    expect(renderToStaticMarkup(createElement(StatusBadge, { status: "done", label: "My custom label" }))).toContain("My custom label");
    await i18n.changeLanguage("en");
    expect(statusLabel("in_review", "In review")).toBe("In review");
  });
});
