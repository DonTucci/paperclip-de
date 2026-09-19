import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const englishPath = join(root, "ui", "src", "i18n", "fork", "en.json");
const germanPath = join(root, "ui", "src", "i18n", "fork", "de.json");
const english = JSON.parse(readFileSync(englishPath, "utf8"));
const germanRaw = readFileSync(germanPath, "utf8");
const german = JSON.parse(germanRaw);

const exact = new Map([
  ["Connect your own tool", "Eigenes Werkzeug verbinden"],
  ["Add a custom MCP server or paste an existing configuration.", "Einen benutzerdefinierten MCP-Server hinzufügen oder eine bestehende Konfiguration einfügen."],
  ["Control how your account appears in the sidebar and other board surfaces.", "Legen Sie fest, wie Ihr Konto in der Seitenleiste und in anderen Bereichen erscheint."],
  ["Shown in the sidebar account footer and comment author surfaces.", "Wird im Kontobereich der Seitenleiste und als Name bei Kommentaren angezeigt."],
  ["Let any agent you manage archive tasks out of your inbox.", "Alle von Ihnen verwalteten Agenten dürfen Aufgaben aus Ihrem Posteingang archivieren."],
  ["Restrict inbox tidying to the agents you pick below.", "Nur die unten ausgewählten Agenten dürfen Ihren Posteingang aufräumen."],
  ["Agents can never archive tasks from your inbox.", "Agenten dürfen keine Aufgaben aus Ihrem Posteingang archivieren."],
  ["Browse", "Entdecken"],
  ["Review", "Prüfen"],
  ["Search connectors…", "Integrationen durchsuchen…"],
  ["Search connectors", "Integrationen durchsuchen"],
  ["Loading connectors", "Integrationen werden geladen"],
  ["Connector list", "Liste der Integrationen"],
  ["paperclip", "Paperclip"],
  ["Back to board", "Zurück zur Aufgabenübersicht"],
  ["Share link", "Freigabelink"],
  ["Collapse item", "Element einklappen"],
  ["Open your activity, task, and usage ledger.", "Öffnen Sie Ihren Aktivitäts-, Aufgaben- und Nutzungsverlauf."],
  ["Invite history below keeps the audit trail.", "Der Einladungsverlauf unten bildet das Prüfprotokoll ab."],
  ["Name the skill and set the route-safe slug.", "Benennen Sie die Fähigkeit und legen Sie einen URL-tauglichen Slug fest."],
  ["Use manual model", "Modell manuell auswählen"],
  ["Unstar this skill", "Markierung dieser Fähigkeit entfernen"],
  ["Unstar agent", "Markierung des Agenten entfernen"],
  ["Star this skill", "Diese Fähigkeit markieren"],
  ["Token history", "Token-Verlauf"],
  ["GitHub identity history", "GitHub-Identitätsverlauf"],
  ["Delivery and publication history", "Verlauf der Auslieferungen und Veröffentlichungen"],
  ["chat history", "Chatverlauf"],
  ["Activity history", "Aktivitätsverlauf"],
  ["Loading history…", "Verlauf wird geladen…"],
  ["No history yet. Save the instructions to create the first revision.", "Noch kein Verlauf vorhanden. Speichern Sie die Anweisungen, um die erste Version zu erstellen."],
  ["New client secret", "Neues Client-Secret"],
  ["Client secret", "Client-Secret"],
  ["Webhook secret", "Webhook-Secret"],
  ["Search secrets…", "Secrets suchen…"],
  ["Search secrets", "Secrets suchen"],
  ["New secret", "Neues Secret"],
  ["New secret here", "Hier neues Secret erstellen"],
  ["Create new secret", "Neues Secret erstellen"],
  ["Create new secret…", "Neues Secret erstellen…"],
  ["All secrets", "Alle Secrets"],
  ["My secrets", "Meine Secrets"],
  ["No saved secret", "Kein gespeichertes Secret"],
  ["Failed to save secrets", "Secrets konnten nicht gespeichert werden"],
  ["Stage secrets saved", "Secrets der Phase gespeichert"],
  ["Paperclip could not save the stage secrets.", "Paperclip konnte die Secrets der Phase nicht speichern."],
  ["Skill release", "Veröffentlichung der Fähigkeit"],
  ["Import a skill", "Fähigkeit importieren"],
  ["Skills imported", "Fähigkeiten importiert"],
  ["Skill import results", "Ergebnisse des Fähigkeitenimports"],
  ["Loading skill…", "Fähigkeit wird geladen…"],
  ["Loading skills...", "Fähigkeiten werden geladen…"],
  ["Project skill scan complete", "Prüfung der Projektfähigkeiten abgeschlossen"],
  ["Resize skill folders", "Ordner für Fähigkeiten skalieren"],
  ["One-line promise for the skill", "Kurzbeschreibung der Fähigkeit"],
  ["Imported", "Importiert"],
  ["Remove attachment", "Anhang entfernen"],
  ["Fixture shape", "Struktur der Testdaten"],
  ["Fixture rows", "Zeilen der Testdaten"],
  ["This section captures the board-side invite creation flow, copied-link state, audit table, and the edge states that are otherwise tedious to stage.", "Dieser Abschnitt erfasst das Erstellen von Einladungen in der Aufgabenübersicht, den Zustand kopierter Links, die Prüftabelle und schwer nachstellbare Randfälle."],
  ["Retire direct child items", "Direkte untergeordnete Elemente stilllegen"],
  ["Already available on child items", "Bereits für untergeordnete Elemente verfügbar"],
  ["No stopped items match your search.", "Keine angehaltenen Elemente entsprechen Ihrer Suche."],
  ["Block until all child items are done or cancelled", "Blockieren, bis alle untergeordneten Elemente erledigt oder abgebrochen sind"],
  ["Saved manager is missing from this organization. Choose a new manager or clear.", "Die gespeicherte Führungskraft fehlt in dieser Organisation. Wählen Sie eine neue Führungskraft oder heben Sie die Auswahl auf."],
  ["Built from a real Paperclip development run, then sanitized so no secrets, local paths, or environment details survive into the fixture.", "Aus einem echten Paperclip-Entwicklungslauf erstellt und danach bereinigt, sodass die Testdaten keine Secrets, lokalen Pfade oder Umgebungsdetails enthalten."],
  ["Set watchdog", "Überwachung festlegen"],
  ["Browse skills store", "Fähigkeitenkatalog durchsuchen"],
  ["Resume agent", "Agent fortsetzen"],
  ["Unsaved routine edits", "Ungespeicherte Änderungen am Ablauf"],
  ["Tool call", "Werkzeugaufruf"],
  ["Permissions / Trust", "Berechtigungen / Vertrauen"],
  ["Invalid board claim URL.", "Ungültige URL zur Übernahme der Aufgabenübersicht."],
  ["Flat list", "Flache Liste"],
  ["Share feedback", "Feedback teilen"],
  ["User secret key", "Schlüssel des Benutzer-Secrets"],
  ["Add tool", "Werkzeug hinzufügen"],
  ["Disable failed", "Deaktivierung fehlgeschlagen"],
  ["Git worktree", "Git-Arbeitsbaum"],
  ["Task run ledger", "Aufgabenlauf-Protokoll"],
  ["Add agent…", "Agent hinzufügen…"],
  ["Save failed", "Speichern fehlgeschlagen"],
  ["Move failed", "Verschieben fehlgeschlagen"],
  ["Copy header", "Kopfzeile kopieren"],
  ["Query debug", "Abfrage debuggen"],
  ["Connect chat", "Chat verbinden"],
  ["Live agent runs", "Aktive Agentenläufe"],
  ["Turn by turn", "Schritt für Schritt"],
  ["Edit agent", "Agent bearbeiten"],
  ["Matching issues…", "Passende Aufgaben…"],
  ["Invalid JSON.", "Ungültiges JSON."],
  ["Stop and done", "Anhalten und als erledigt markieren"],
  ["Mobile navigation", "Mobile Navigation"],
  ["Org Chart", "Organigramm"],
  ["Pinned source revision", "Angeheftete Quellversion"],
  ["Plugin integration", "Plugin-Integration"],
  ["Remote workspace ref", "Referenz des entfernten Arbeitsbereichs"],
  ["Remote-managed workspace", "Extern verwalteter Arbeitsbereich"],
  ["Review →", "Prüfen →"],
  ["Review conversation", "Unterhaltung prüfen"],
  ["Run ledger", "Laufprotokoll"],
  ["Runner lifecycle", "Runner-Lebenszyklus"],
  ["Runtime failed closed.", "Laufzeit wurde sicher beendet."],
  ["Secrets & env inputs", "Secrets und Umgebungseingaben"],
  ["Show rendered Markdown", "Gerendertes Markdown anzeigen"],
  ["Skills Store", "Fähigkeitenkatalog"],
  ["Timeout (sec)", "Zeitlimit (Sek.)"],
  ["Unsaved edits", "Ungespeicherte Änderungen"],
  ["View agent", "Agent anzeigen"],
  ["View policy", "Richtlinie anzeigen"],
  ["Open Vercel Connect", "Vercel Connect öffnen"],
  ["Home", "Startseite"],
  ["Open sidebar", "Seitenleiste öffnen"],
  ["Dismiss announcement", "Ankündigung schliessen"],
  ["Skip to main content", "Zum Hauptinhalt springen"],
  ["Skip to Main Content", "Zum Hauptinhalt springen"],
  ["Collapse command details", "Befehlsdetails einklappen"],
  ["Collapse input", "Eingabe einklappen"],
  ["Collapse selected group", "Ausgewählte Gruppe einklappen"],
  ["Collapse sub-tasks", "Teilaufgaben einklappen"],
  ["Collapse stdout", "Standardausgabe einklappen"],
  ["Collapse continuation handoff", "Fortsetzungsübergabe einklappen"],
  ["Collapse folder", "Ordner einklappen"],
  ["Collapse JSON value", "JSON-Wert einklappen"],
  ["Collapse decision", "Entscheidung einklappen"],
  ["Collapse tool details", "Werkzeugdetails einklappen"],
  ["Collapse cold lanes", "Inaktive Spalten einklappen"],
]);

function isTechnical(value) {
  return (
    /^(?:[A-Za-z]:\\|\\\\|\/|\.|https?:\/\/|wss?:\/\/|vault:\/\/|arn:|@\/|@[A-Za-z0-9_-]+\/)/.test(value)
    || /^[^\s]+\/[^\s]+$/.test(value)
    || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    || /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+$/.test(value)
    || /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/.test(value)
    || /\.(?:md|json|yaml|yml|pem|key)$/i.test(value)
    || /^(?:GET|POST|PUT|PATCH|DELETE)\s+\//.test(value)
    || /^--?[a-z0-9][a-z0-9-]*(?:=\S+)?$/.test(value)
  );
}

const terminology = [
  [/Fertigkeiten/g, "Fähigkeiten"],
  [/Fertigkeits/g, "Fähigkeits"],
  [/Fertigkeit/g, "Fähigkeit"],
  [/fertigkeiten/g, "fähigkeiten"],
  [/fertigkeits/g, "fähigkeits"],
  [/fertigkeit/g, "fähigkeit"],
  [/Geschichten/g, "Verläufe"],
  [/Geschichte/g, "Verlauf"],
  [/geschichte/g, "verlauf"],
  [/Gewölbe/g, "Tresor"],
  [/gewölbe/g, "tresor"],
  [/Bühnen/g, "Phasen"],
  [/Bühne/g, "Phase"],
  [/Einfuhr/g, "Import"],
  [/Eingeführt/g, "Importiert"],
  [/Eingeführte/g, "Importierte"],
  [/Geschicklichkeiten/g, "Fähigkeiten"],
  [/Geschicklichkeit/g, "Fähigkeit"],
  [/Artikel/g, "Element"],
  [/artikel/g, "element"],
  [/\bGeretteter\b/g, "Gespeicherter"],
  [/\bgerettet\b/g, "gespeichert"],
  [/\bretten\b/g, "speichern"],
  [/\bUngerettet\b/g, "Nicht gespeichert"],
  [/\bungerettet\b/g, "nicht gespeichert"],
  [/\bGeschaffene\b/g, "Erstellte"],
  [/\bgeschaffen\b/g, "erstellt"],
  [/\bschaffen\b/g, "erstellen"],
  [/Kundengeheimnisse/g, "Client-Secrets"],
  [/Kundengeheimnis/g, "Client-Secret"],
  [/Webhook-Geheimnisse/g, "Webhook-Secrets"],
  [/Webhook-Geheimnis/g, "Webhook-Secret"],
  [/Organisationsgeheimnisse/g, "Organisations-Secrets"],
  [/Organisationsgeheimnis/g, "Organisations-Secret"],
  [/Benutzergeheimnisse/g, "Benutzer-Secrets"],
  [/Benutzergeheimnis/g, "Benutzer-Secret"],
  [/Projektgeheimnisse/g, "Projekt-Secrets"],
  [/Projektgeheimnis/g, "Projekt-Secret"],
  [/Geheimnisse/g, "Secrets"],
  [/Geheimnis/g, "Secret"],
  [/geheimnisse/g, "Secrets"],
  [/geheimnis/g, "Secret"],
];

let protectedCount = 0;
let exactCount = 0;
let terminologyCount = 0;
for (const [key, source] of Object.entries(english)) {
  if (!(key in german)) continue;
  if (isTechnical(source)) {
    if (german[key] !== source) protectedCount += 1;
    german[key] = source;
  }
  if (exact.has(source)) {
    const next = exact.get(source);
    if (german[key] !== next) exactCount += 1;
    german[key] = next;
  }
  let next = german[key];
  for (const [pattern, replacement] of terminology) {
    next = next.replace(pattern, replacement);
  }
  if (next !== german[key]) terminologyCount += 1;
  german[key] = next.replaceAll("ß", "ss");
}

const output = `${JSON.stringify(german, null, 2)}\n`;
if (process.argv.includes("--check")) {
  if (output !== germanRaw) {
    console.error("Der deutsche Katalog benötigt den Terminologie-Abgleich.");
    process.exitCode = 1;
  }
} else {
  writeFileSync(germanPath, output);
}
console.log(`${protectedCount} technische Werte geschützt, ${exactCount} feste Übersetzungen und ${terminologyCount} Terminologieeinträge verfeinert.`);
