import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = join(root, "ui", "src");
const entries = [];
const seen = new Set();
let ignoredTechnical = 0;

const textAttributes = new Set([
  "action",
  "alt",
  "aria-label",
  "badgeLabel",
  "description",
  "emptyMessage",
  "label",
  "message",
  "placeholder",
  "searchPlaceholder",
  "subtitle",
  "title",
  "tooltip",
]);

function walk(folder) {
  for (const item of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, item.name);
    if (item.isDirectory()) {
      if (!["i18n", "fixtures", "node_modules"].includes(item.name)) walk(path);
      continue;
    }
    if (!/\.tsx?$/.test(item.name) || /\.(test|spec|fixtures)\./.test(item.name)) continue;
    const source = readFileSync(path, "utf8");
    auditFile(path, source);
  }
}

function auditFile(path, source) {
  function add(offset, kind, text, confidence = "hoch") {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (!/[A-Za-zÄÖÜäöü]{2}/.test(normalized)) return;
    const file = relative(root, path).replaceAll("\\", "/");
    if (isIntentionalTechnicalText(file, kind, normalized)) {
      ignoredTechnical++;
      return;
    }
    const entry = {
      file,
      line: source.slice(0, offset).split("\n").length,
      confidence,
      kind,
      text: normalized,
    };
    const identity = `${entry.file}:${entry.line}:${entry.kind}:${entry.text}`;
    if (seen.has(identity)) return;
    seen.add(identity);
    entries.push(entry);
  }

  // Eine echte öffnende JSX-Marke vor dem Text verhindert, dass normale
  // Vergleichsoperatoren als sichtbare Oberfläche erscheinen.
  for (const match of source.matchAll(/<[A-Za-z][^>\r\n]*>\s*([^<>{}\r\n]*[A-Za-zÄÖÜäöü][^<>{}\r\n]*)\s*<\//g)) {
    const text = match[1].trim();
    if (!text || /(?:===|!==|&&|\|\||=>|\?\s*\(|^\)\s*:)/.test(text)) continue;
    add(match.index + match[0].indexOf(match[1]), "Sichtbarer JSX-Text", text);
  }

  for (const match of source.matchAll(/>[ \t]*\r?\n[ \t]*([^<>{}\r\n]*[A-Za-zÄÖÜäöü][^<>{}\r\n]*)[ \t]*\r?\n[ \t]*</g)) {
    const text = match[1].trim();
    if (!text || /(?:===|!==|&&|\|\||=>|\?\s*\(|^\)\s*:)/.test(text)) continue;
    add(match.index + match[0].indexOf(match[1]), "Sichtbarer JSX-Text", text);
  }

  const names = [...textAttributes].join("|");
  const jsxAttributes = new RegExp(`\\b(${names})\\s*=\\s*"([^"\\r\\n]+)"`, "g");
  for (const match of source.matchAll(jsxAttributes)) {
    add(match.index, `JSX-Attribut ${match[1]}`, match[2]);
  }

  const objectFields = new RegExp(`\\b(${names})\\s*:\\s*"([^"\\r\\n]+)"`, "g");
  for (const match of source.matchAll(objectFields)) {
    if (match[1] === "action") {
      ignoredTechnical++;
      continue;
    }
    add(match.index, `Objektfeld ${match[1]}`, match[2], "mittel");
  }

  const expressionAttributes = new RegExp(
    `\\b(${names})\\s*=\\s*\\{[^{}\\r\\n]*?\\?\\s*"([^"\\r\\n]+)"\\s*:\\s*"([^"\\r\\n]+)"[^{}\\r\\n]*?\\}`,
    "g",
  );
  for (const match of source.matchAll(expressionAttributes)) {
    add(match.index, `Bedingtes JSX-Attribut ${match[1]}`, match[2]);
    add(match.index, `Bedingtes JSX-Attribut ${match[1]}`, match[3]);
  }

  const visibleCalls = /\b(?:alert|confirm|prompt|toast(?:\.(?:error|info|success|warning))?)\s*\(\s*"([^"\r\n]+)"/g;
  for (const match of source.matchAll(visibleCalls)) {
    add(match.index, "Direkte Benutzermeldung", match[1]);
  }
}

function isIntentionalTechnicalText(file, kind, text) {
  if (
    file === "ui/src/pages/IssueDetail.tsx"
    && ["Assignee", "Originating"].includes(text)
    && (kind === "Objektfeld label" || kind === "JSX-Attribut label")
  ) {
    return true;
  }
  if (/^&(?:lt|gt|middot|rsaquo|times|rarr);/.test(text)) return true;
  if (/^(?:[A-Za-z]:\\|\\\\|\/|\.|https?:\/\/|wss?:\/\/|vault:\/\/|arn:|@\/|@[A-Za-z0-9_-]+\/)/.test(text)) return true;
  if (/^[^\s]+\/[^\s]+$/.test(text)) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return true;
  if (/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+$/.test(text)) return true;
  if (/\.(?:md|json|yaml|yml)$/i.test(text)) return true;
  if (/\s(?:&&|\|\|)\s/.test(text)) return true;
  return false;
}

walk(sourceRoot);
entries.sort((left, right) =>
  left.file.localeCompare(right.file) || left.line - right.line || left.text.localeCompare(right.text),
);

const report = {
  note: "AST-basierte Prüfliste wahrscheinlicher sichtbarer Oberflächentexte. Produktnamen, technische Beschriftungen und bewusst englische Texte müssen weiterhin manuell bewertet werden. Texte aus Server und Plugins werden separat geprüft.",
  total: entries.length,
  files: new Set(entries.map((entry) => entry.file)).size,
  ignoredTechnical,
  byKind: Object.fromEntries(
    [...new Set(entries.map((entry) => entry.kind))]
      .sort()
      .map((kind) => [kind, entries.filter((entry) => entry.kind === kind).length]),
  ),
  entries,
};
const destination = join(root, "tmp", "german-ui-audit.json");
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, JSON.stringify(report, null, 2) + "\n");
console.log(`${report.total} wahrscheinliche Textkandidaten in ${report.files} Dateien. Bericht: ${destination}`);
if (process.argv.includes("--check") && report.total > 0) {
  console.error("Die deutsche Oberfläche enthält noch wahrscheinliche, nicht katalogisierte Texte.");
  process.exitCode = 1;
}
