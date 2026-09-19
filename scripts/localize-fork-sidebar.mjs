import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../ui/src/components/Sidebar.tsx", import.meta.url);
const en = JSON.parse(readFileSync(new URL("../ui/src/i18n/fork/en.json", import.meta.url), "utf8"));
let source = readFileSync(file, "utf8");
for (const [key, value] of Object.entries(en)) {
  if (!key.startsWith("nav.")) continue;
  for (const attribute of ["label", "badgeLabel"]) {
    source = source.replaceAll(`${attribute}=${JSON.stringify(value)}`, `${attribute}={tf(${JSON.stringify(key)})}`);
  }
}
source = source.replaceAll('rail ? "New Task" : undefined', 'rail ? tf("nav.newTask") : undefined');
source = source.replaceAll('>New Task<', '>{tf("nav.newTask")}<');
if (!source.includes('import { tf }')) source = 'import { tf } from "../i18n/fork";\n' + source;
writeFileSync(file, source);
