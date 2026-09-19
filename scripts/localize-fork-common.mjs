import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Explizite Wörterliste für statische JSX-Texte und Textattribute.
// Keine Datenwerte, Benutzereingaben, API-Schlüssel oder dynamischen Ausdrücke ersetzen.
const translations = {
  "Save": "Speichern", "Save changes": "Änderungen speichern", "Cancel": "Abbrechen",
  "Close": "Schliessen", "Delete": "Löschen", "Remove": "Entfernen", "Edit": "Bearbeiten",
  "Create": "Erstellen", "Add": "Hinzufügen", "Update": "Aktualisieren", "Refresh": "Aktualisieren",
  "Retry": "Erneut versuchen", "Try again": "Erneut versuchen", "Continue": "Weiter",
  "Next": "Weiter", "Back": "Zurück", "Previous": "Zurück", "Done": "Fertig",
  "Finish": "Abschliessen", "Apply": "Anwenden", "Reset": "Zurücksetzen", "Clear": "Leeren",
  "Search": "Suche", "Search...": "Suchen…", "Filter": "Filter", "Filters": "Filter",
  "Clear filters": "Filter zurücksetzen", "All": "Alle", "None": "Keine", "Default": "Standard",
  "Name": "Name", "Title": "Titel", "Description": "Beschreibung", "Details": "Details",
  "Overview": "Übersicht", "Dashboard": "Übersicht", "Settings": "Einstellungen",
  "General": "Allgemein", "Advanced": "Erweitert", "Advanced settings": "Erweiterte Einstellungen",
  "Status": "Status", "Priority": "Priorität", "Assignee": "Zuständig", "Owner": "Verantwortlich",
  "Created": "Erstellt", "Updated": "Aktualisiert", "Created at": "Erstellt am", "Updated at": "Aktualisiert am",
  "Created by": "Erstellt von", "Last updated": "Zuletzt aktualisiert", "Actions": "Aktionen",
  "More actions": "Weitere Aktionen", "Open": "Öffnen", "View": "Ansehen",
  "View all": "Alle anzeigen", "Show more": "Mehr anzeigen", "Show less": "Weniger anzeigen",
  "Expand": "Ausklappen", "Collapse": "Einklappen", "Copy": "Kopieren", "Copy link": "Link kopieren",
  "Copy ID": "ID kopieren", "Copied": "Kopiert", "Download": "Herunterladen", "Upload": "Hochladen",
  "Export": "Exportieren", "Import": "Importieren", "Preview": "Vorschau", "Help": "Hilfe",
  "Documentation": "Dokumentation", "Learn more": "Mehr erfahren", "Loading...": "Wird geladen…",
  "Saving...": "Wird gespeichert…", "Deleting...": "Wird gelöscht…", "Creating...": "Wird erstellt…",
  "No results": "Keine Ergebnisse", "No results found": "Keine Ergebnisse gefunden",
  "No results found.": "Keine Ergebnisse gefunden.", "Optional": "Optional", "Required": "Erforderlich",
  "Enabled": "Aktiviert", "Disabled": "Deaktiviert", "Enable": "Aktivieren", "Disable": "Deaktivieren",
  "Yes": "Ja", "No": "Nein", "Confirm": "Bestätigen", "Dismiss": "Verwerfen",
  "Organization": "Organisation", "Organizations": "Organisationen", "Company": "Unternehmen",
  "Companies": "Unternehmen", "Create organization": "Organisation erstellen",
  "New organization": "Neue Organisation", "New Organization": "Neue Organisation",
  "Create company": "Unternehmen erstellen", "New company": "Neues Unternehmen",
  "Profile": "Profil", "Display name": "Anzeigename", "Email": "E-Mail", "Password": "Passwort",
  "Sign in": "Anmelden", "Sign out": "Abmelden", "Sign up": "Registrieren", "Account": "Konto",
  "Members": "Mitglieder", "Invite": "Einladen", "Invites": "Einladungen", "Invite people": "Personen einladen",
  "Role": "Rolle", "Roles": "Rollen", "Permissions": "Berechtigungen", "Access": "Zugriff",
  "Authentication": "Authentifizierung", "Security": "Sicherheit", "Session": "Sitzung", "Sessions": "Sitzungen",
  "Agent": "Agent", "Agents": "Agenten", "New agent": "Neuer Agent", "New Agent": "Neuer Agent",
  "Create agent": "Agent erstellen", "Hire agent": "Agent einstellen", "Configure": "Konfigurieren",
  "Configuration": "Konfiguration", "Instructions": "Anweisungen", "Capabilities": "Fähigkeiten",
  "Model": "Modell", "Models": "Modelle", "Provider": "Anbieter", "Providers": "Anbieter",
  "Adapter": "Adapter", "Adapters": "Adapter", "Environment": "Umgebung", "Environments": "Umgebungen",
  "Environment variables": "Umgebungsvariablen", "Variables": "Variablen", "Value": "Wert", "Key": "Schlüssel",
  "Start": "Starten", "Stop": "Stoppen", "Pause": "Pausieren", "Resume": "Fortsetzen",
  "Restart": "Neu starten", "Run": "Ausführen", "Run now": "Jetzt ausführen", "Runs": "Ausführungen",
  "History": "Verlauf", "Logs": "Protokolle", "Output": "Ausgabe", "Input": "Eingabe",
  "Error": "Fehler", "Errors": "Fehler", "Warning": "Warnung", "Warnings": "Warnungen",
  "Success": "Erfolg", "Failed": "Fehlgeschlagen", "Running": "Läuft", "Pending": "Ausstehend",
  "Active": "Aktiv", "Paused": "Pausiert", "Archived": "Archiviert", "Archive": "Archivieren",
  "Unarchive": "Aus Archiv wiederherstellen", "Restore": "Wiederherstellen",
  "Task": "Aufgabe", "Tasks": "Aufgaben", "New task": "Neue Aufgabe", "New Task": "Neue Aufgabe",
  "Create task": "Aufgabe erstellen", "Add task": "Aufgabe hinzufügen", "My tasks": "Meine Aufgaben",
  "All tasks": "Alle Aufgaben", "Subtasks": "Unteraufgaben", "Parent task": "Übergeordnete Aufgabe",
  "Dependencies": "Abhängigkeiten", "Blocked by": "Blockiert durch", "Labels": "Etiketten",
  "Comments": "Kommentare", "Comment": "Kommentar", "Activity": "Aktivität", "Attachments": "Anhänge",
  "Files": "Dateien", "File": "Datei", "Documents": "Dokumente", "Document": "Dokument",
  "Send": "Senden", "Reply": "Antworten", "Submit": "Absenden", "Message": "Nachricht",
  "Messages": "Nachrichten", "Unread": "Ungelesen", "Mark as read": "Als gelesen markieren",
  "Mark as unread": "Als ungelesen markieren", "Inbox": "Posteingang", "Notifications": "Benachrichtigungen",
  "Project": "Projekt", "Projects": "Projekte", "New project": "Neues Projekt", "Create project": "Projekt erstellen",
  "Workspace": "Arbeitsbereich", "Workspaces": "Arbeitsbereiche", "Repository": "Repository",
  "Repositories": "Repositories", "Branch": "Branch", "Path": "Pfad", "Working directory": "Arbeitsverzeichnis",
  "Goal": "Ziel", "Goals": "Ziele", "New goal": "Neues Ziel", "Create goal": "Ziel erstellen",
  "Progress": "Fortschritt", "Budget": "Budget", "Monthly budget": "Monatliches Budget",
  "Costs": "Kosten", "Cost": "Kosten", "Total": "Gesamt", "Usage": "Nutzung", "Limit": "Limit",
  "Remaining": "Verbleibend", "Spent": "Ausgegeben", "This month": "Diesen Monat",
  "Today": "Heute", "Yesterday": "Gestern", "Last 7 days": "Letzte 7 Tage", "Last 30 days": "Letzte 30 Tage",
  "Date": "Datum", "Time": "Zeit", "Duration": "Dauer", "Schedule": "Zeitplan", "Frequency": "Häufigkeit",
  "Timezone": "Zeitzone", "Routine": "Routine", "Routines": "Routinen", "New routine": "Neue Routine",
  "Create routine": "Routine erstellen", "Trigger": "Auslöser", "Triggers": "Auslöser",
  "Approval": "Freigabe", "Approvals": "Freigaben", "Approve": "Genehmigen", "Reject": "Ablehnen",
  "Request changes": "Änderungen anfordern", "Approved": "Genehmigt", "Rejected": "Abgelehnt",
  "Skills": "Fähigkeiten", "Skill": "Fähigkeit", "Tools": "Werkzeuge", "Tool": "Werkzeug",
  "Connectors": "Verbindungen", "Connections": "Verbindungen", "Connect": "Verbinden", "Disconnect": "Trennen",
  "Connected": "Verbunden", "Disconnected": "Getrennt", "Install": "Installieren", "Uninstall": "Deinstallieren",
  "Installed": "Installiert", "Version": "Version", "Updates": "Aktualisierungen", "Secrets": "Zugangsdaten",
  "API key": "API-Schlüssel", "API keys": "API-Schlüssel", "Token": "Token", "Tokens": "Token",
  "Test connection": "Verbindung testen", "Test": "Testen", "Health": "Funktionsstatus",
  "Network": "Netzwerk", "Storage": "Speicher", "Local": "Lokal", "Remote": "Entfernt",
  "Source": "Quelle", "Target": "Ziel", "Type": "Typ", "Category": "Kategorie",
  "Tags": "Schlagwörter", "Notes": "Notizen", "Summary": "Zusammenfassung", "Plan": "Plan",
  "Reason": "Begründung", "Results": "Ergebnisse", "Result": "Ergebnis", "Artifacts": "Arbeitsergebnisse",
  "Timeline": "Zeitachse", "Decisions": "Entscheidungen", "Audit": "Prüfprotokoll",
  "Appearance": "Darstellung", "Theme": "Design", "Light": "Hell", "Dark": "Dunkel",
  "System": "System", "Language": "Sprache", "Save profile": "Profil speichern",
  "Upload photo": "Foto hochladen", "Change photo": "Foto ändern", "Go home": "Zur Startseite",
  "Open dashboard": "Übersicht öffnen", "Loading profile...": "Profil wird geladen…"
};

const root = fileURLToPath(new URL("../", import.meta.url));
const catalogs = Object.fromEntries(["en", "de"].map((language) => [language, JSON.parse(readFileSync(join(root, `ui/src/i18n/fork/${language}.json`), "utf8"))]));
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let files = 0;
let replacements = 0;
function visit(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name);
    if (entry.isDirectory()) {
      if (!["i18n", "fixtures", "node_modules"].includes(entry.name)) visit(path);
      continue;
    }
    if (!entry.name.endsWith(".tsx") || /\.(test|spec|fixtures)\./.test(entry.name)) continue;
    let source = readFileSync(path, "utf8");
    const before = source;
    for (const [english, german] of Object.entries(translations)) {
      const key = `text.${english}`;
      let used = false;
      const expression = `tf(${JSON.stringify(key)})`;
      // Die gleichen Übersetzungen bleiben bei wiederholtem Ausführen stabil.
      source = source.replace(new RegExp(`>(\\s*)${escape(english)}(\\s*)<`, "g"), (_, lead, tail) => {
        replacements++;
        used = true;
        return `>${lead}{${expression}}${tail}<`;
      });
      source = source.replace(new RegExp(`\\b(label|title|placeholder|aria-label|message|action|badgeLabel)="${escape(english)}"`, "g"), (match, attribute, offset) => {
        // Diese Komponente verwendet label auch als technischen Identifikator.
        if (source.slice(source.lastIndexOf("<", offset), offset).startsWith("<AttributionAvatar")) return match;
        replacements++;
        used = true;
        return `${attribute}={${expression}}`;
      });
      if (used) {
        catalogs.en[key] = english;
        catalogs.de[key] = german;
      }
    }
    if (source !== before) {
      if (!/import \{[^}]*\btf\b[^}]*\} from/.test(source)) source = 'import { tf } from "@/i18n/fork";\n' + source;
      writeFileSync(path, source);
      files++;
    }
  }
}
visit(join(root, "ui", "src"));
for (const language of ["en", "de"]) writeFileSync(join(root, `ui/src/i18n/fork/${language}.json`), JSON.stringify(catalogs[language], null, 2) + "\n");
console.log(`${replacements} statische Texte in ${files} Dateien angebunden.`);
