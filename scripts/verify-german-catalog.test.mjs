import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCatalog } from "./verify-german-catalog.mjs";

test("erkennt neue Upstream-Texte ohne Übersetzung", () => {
  assert.deepEqual(validateCatalog({ new: "New" }, {}), ["new: deutsche Übersetzung fehlt"]);
});
test("erkennt veränderte Platzhalter und unvollständige Texte", () => {
  assert.equal(validateCatalog({ name: "Hello {{name}}" }, { name: "Hallo {{user}}" }).length, 1);
  assert.equal(validateCatalog({ name: "Hello" }, { name: " " }).length, 1);
});
test("akzeptiert Umlaute und identische Produktnamen", () => {
  assert.deepEqual(validateCatalog({ a: "Open {{name}}", b: "Paperclip" }, { a: "{{name}} öffnen", b: "Paperclip" }), []);
});
test("erkennt unerwünschte Schreibweisen", () => {
  assert.equal(validateCatalog({ a: "Close" }, { a: "Schlie\u00dfen" }).length, 1);
});
