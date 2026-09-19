import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export function validateCatalog(en, de) {
  const errors = [];
  for (const key of new Set([...Object.keys(en), ...Object.keys(de)])) {
    if (typeof en[key] !== "string") errors.push(`${key}: englische Referenz fehlt`);
    if (typeof de[key] !== "string" || !de[key].trim()) {
      errors.push(`${key}: deutsche Übersetzung fehlt`);
      continue;
    }
    if (/[\u00df\u1e9e]/u.test(de[key])) errors.push(`${key}: Schweizer Schreibweise mit ss erforderlich`);
    const placeholders = (text) => [...String(text).matchAll(/{{\s*([^{}]+?)\s*}}/g)].map((m) => m[1]).sort().join("|");
    if (placeholders(en[key]) !== placeholders(de[key])) errors.push(`${key}: Platzhalter stimmen nicht überein`);
  }
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const load = (lang) => JSON.parse(readFileSync(new URL(`../ui/src/i18n/fork/${lang}.json`, import.meta.url), "utf8"));
  const en = load("en");
  const errors = validateCatalog(en, load("de"));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`${Object.keys(en).length} Übersetzungsschlüssel geprüft. Dies ist keine Prüfung der gesamten Oberfläche.`);
  }
}
