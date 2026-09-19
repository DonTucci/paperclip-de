import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogFolder = join(root, "ui", "src", "i18n", "fork");
const catalogPaths = {
  en: join(catalogFolder, "en.json"),
  de: join(catalogFolder, "de.json"),
};
const catalogs = Object.fromEntries(
  Object.entries(catalogPaths).map(([language, path]) => [
    language,
    JSON.parse(readFileSync(path, "utf8")),
  ]),
);

const generatedPath = join(root, "tmp", "generated-german-translations.json");
if (existsSync(generatedPath)) {
  const generated = JSON.parse(readFileSync(generatedPath, "utf8")).translations;
  const existingKeysByText = new Map(
    Object.entries(catalogs.en).map(([key, text]) => [text, key]),
  );
  for (const [english, german] of Object.entries(generated)) {
    const key = existingKeysByText.get(english)
      ?? `auto.${createHash("sha256").update(english).digest("hex").slice(0, 16)}`;
    catalogs.en[key] = english;
    catalogs.de[key] = german;
    existingKeysByText.set(english, key);
  }
}

const translations = Object.entries(catalogs.en)
  .map(([key, english]) => ({ key, english, german: catalogs.de[key] }))
  .filter(({ german }) => typeof german === "string")
  .sort((left, right) => right.english.length - left.english.length);
const translationsByEnglish = new Map(translations.map((entry) => [entry.english, entry]));

const decodeHtml = (value) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&apos;", "'")
  .replaceAll("&quot;", '"')
  .replaceAll("&rsquo;", "’")
  .replaceAll("&hellip;", "…")
  .replaceAll("&rarr;", "→")
  .replaceAll("&middot;", "·")
  .replaceAll("&rsaquo;", "›")
  .replaceAll("&times;", "×");
const audit = JSON.parse(readFileSync(join(root, "tmp", "german-ui-audit.json"), "utf8"));
const candidatesByFile = new Map();
for (const entry of audit.entries) {
  const values = candidatesByFile.get(entry.file) ?? new Map();
  const english = decodeHtml(entry.text);
  const variants = values.get(english) ?? new Set();
  variants.add(entry.text);
  values.set(english, variants);
  candidatesByFile.set(entry.file, values);
}

const textAttributes = [
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
];
const attributePattern = textAttributes.join("|");
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeFlexibleWhitespace = (value) => value
  .split(/\s+/)
  .map(escape)
  .join("[ \\t]+");
const encodeJsxText = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll("'", "&apos;")
  .replaceAll('"', "&quot;");

let changedFiles = 0;
let replacements = 0;

function addImport(source) {
  if (/import \{[^}]*\btf\b[^}]*\} from ["']@\/i18n\/fork["']/.test(source)) return source;
  const importLine = 'import { tf } from "@/i18n/fork";\n';
  const directive = source.match(/^(?:\uFEFF)?(["']use [^"']+["'];\r?\n)/);
  if (!directive) return importLine + source;
  return source.slice(0, directive[0].length) + importLine + source.slice(directive[0].length);
}

function visit(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) {
      if (!["i18n", "fixtures", "node_modules"].includes(entry.name)) visit(path);
      continue;
    }
    if (!/\.tsx?$/.test(entry.name) || /\.(test|spec|fixtures)\./.test(entry.name)) continue;

    let source = readFileSync(path, "utf8");
    const before = source;
    const relativePath = relative(root, path).replaceAll("\\", "/");
    const fileTranslations = [...(candidatesByFile.get(relativePath) ?? new Map())]
      .map(([english, variants]) => {
        const translation = translationsByEnglish.get(english);
        return translation ? { ...translation, variants } : null;
      })
      .filter(Boolean)
      .sort((left, right) => right.english.length - left.english.length);
    for (const { key, english, variants } of fileTranslations) {
      const expression = `tf(${JSON.stringify(key)})`;
      const textVariants = new Set([english, encodeJsxText(english), ...variants]);
      for (const text of textVariants) {
        source = source.replace(
          new RegExp(`>(\\s*)${escapeFlexibleWhitespace(text)}(\\s*)<`, "g"),
          (_match, lead, tail) => {
            replacements++;
            return `>${lead}{${expression}}${tail}<`;
          },
        );
      }
      source = source.replace(
        new RegExp(`\\b(${attributePattern})="${escape(english)}"`, "g"),
        (match, attribute, offset) => {
          if (source[offset - 1] === "[") return match;
          if (source.slice(source.lastIndexOf("<", offset), offset).startsWith("<AttributionAvatar")) {
            return match;
          }
          replacements++;
          return `${attribute}={${expression}}`;
        },
      );
      source = source.replace(
        new RegExp(`\\b(${attributePattern})\\s*=\\s*(["'])${escape(english)}\\2`, "g"),
        (match, name, _quote, offset) => {
          if (source[offset - 1] === "[") return match;
          replacements++;
          return `${name} = ${expression}`;
        },
      );
      source = source.replace(
        new RegExp(`(\\b(?:${attributePattern})\\s*=\\s*\\{[^{}\\r\\n]*?)(["'])${escape(english)}\\2`, "g"),
        (_match, prefix) => {
          replacements++;
          return `${prefix}${expression}`;
        },
      );
      source = source.replace(
        new RegExp(`(\\b(?:alert|confirm|prompt|toast(?:\\.(?:error|info|success|warning))?)\\s*\\(\\s*)(["'])${escape(english)}\\2`, "g"),
        (_match, prefix) => {
          replacements++;
          return `${prefix}${expression}`;
        },
      );
    }
    if (source !== before) {
      source = addImport(source);
      writeFileSync(path, source);
      changedFiles++;
    }
  }
}

visit(join(root, "ui", "src"));
for (const [language, path] of Object.entries(catalogPaths)) {
  const sorted = Object.fromEntries(
    Object.entries(catalogs[language]).sort(([left], [right]) => left.localeCompare(right)),
  );
  writeFileSync(path, JSON.stringify(sorted, null, 2) + "\n");
}
console.log(`${replacements} sichtbare Texte in ${changedFiles} Dateien angebunden.`);
console.log(`${Object.keys(catalogs.en).length} Katalogeinträge vorhanden.`);
