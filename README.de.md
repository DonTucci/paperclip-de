# Paperclip auf Deutsch

Dies ist der vorbereitete deutsche Paperclip-Fork mit Schweizer Schreibweise. Die statische Oberfläche ist vollständig in einen eigenen Übersetzungskatalog überführt. Deutsch ist die Standardsprache; Englisch bleibt als Rückfall und kann in den Profileinstellungen gewählt werden.

## Direkt herunterladen und installieren

**[Windows-Installer (EXE) herunterladen](https://github.com/DonTucci/paperclip-de/releases/download/de-v2026.916.5/Paperclip-DE-Setup-de-v2026.916.5.exe)** · **[Release öffnen](https://github.com/DonTucci/paperclip-de/releases/tag/de-v2026.916.5)**

Die EXE startet die Installationsroutine automatisch. Voraussetzung sind Git und Node.js 24.11 oder neuer. EXE herunterladen, doppelt anklicken und den Anweisungen folgen. Die EXE enthält keine Node.js- oder Git-Kopie; diese Programme werden für den Quellcode und die Abhängigkeiten benötigt.

Wer lieber PowerShell verwendet, kann die einzelne Installationsroutine herunterladen:

[install-de.ps1 herunterladen](https://github.com/DonTucci/paperclip-de/releases/download/de-v2026.916.5/install-de.ps1)

```powershell
.\install-de.ps1
```

## Umfang

- 6'033 englische Referenztexte und 6'033 deutsche Texte im Namespace `fork`.
- Navigation, Aufgaben, Agenten, Projekte, Ziele, Einstellungen, Verbindungen, Fähigkeiten, Dialoge, Fehlermeldungen und Hilfetexte sind katalogisiert.
- Eine Terminologieprüfung schützt technische Werte und vereinheitlicht zentrale Begriffe.
- Datum, Uhrzeit und Zahlen richten sich nach Deutsch (Schweiz) oder Englisch (USA).
- Die Spracheinstellung wird im Browser gespeichert und nach dem Neuladen überall angewendet.
- GitHub-Workflows prüfen die deutsche Oberfläche und bereiten Updates aus stabilen Originalreleases als Entwurfs-Pull-Request vor.

Benutzerinhalte, Agentenausgaben, technische Protokollwerte, Plugintexte und vom Server gelieferte externe Inhalte werden nicht automatisch übersetzt. Dadurch bleiben Daten und Schnittstellen unverändert. Die maschinell vorübersetzten Texte wurden durch einen Terminologie-Abgleich und eine Sichtprüfung der wichtigsten Ansichten verbessert; weitere sprachliche Feinarbeit kann nach der Veröffentlichung ohne Architekturänderung erfolgen.

## Lokal entwickeln

Voraussetzungen sind Node.js ab 24.11 und pnpm 9.15.4, wie im Originalprojekt festgelegt.

```powershell
npx --yes pnpm@9.15.4 install --frozen-lockfile
```

## Deutsche Version installieren

Unter Windows kann die deutsche Version mit PowerShell eingerichtet werden. Dafür müssen Git und Node.js 24.11 oder neuer installiert sein:

```powershell
irm https://raw.githubusercontent.com/DonTucci/paperclip-de/fork/deutsch/install-de.ps1 | iex
```

Die Dateien werden unter `%LOCALAPPDATA%\Paperclip-DE` eingerichtet. Anschliessend startet `corepack pnpm@9.15.4 dev:once` die lokale deutsche Version. Das Skript lädt bei einer bestehenden Installation nur den aktuellen Stand des deutschen Branches nach.

Unter Windows kann das ursprüngliche Postinstall-Skript `scripts/link-plugin-dev-sdk.mjs` ohne Berechtigung für symbolische Verknüpfungen scheitern. Die vorhandene produktive Instanz darf nicht als Entwicklungsdatenbank verwendet werden. Für Tests ist ein eigener Datenordner und ein freier Port erforderlich; Einzelheiten stehen in `doc/DEVELOPING.md`.

Der vorhandene Start über `npx paperclipai run` verwendet weiterhin das veröffentlichte Originalpaket. Diese lokale Quellkopie stellt die laufende Instanz nicht automatisch um.

## Übersetzungen pflegen

Nach neuen oder geänderten Originaltexten wird der Katalog erzeugt, verfeinert und geprüft:

```powershell
node scripts/localize-fork-generated.mjs
node scripts/refine-german-catalog.mjs
node scripts/refine-german-catalog.mjs --check
node scripts/verify-german-catalog.mjs
node --test scripts/verify-german-catalog.test.mjs
node scripts/audit-german-ui.mjs --check
```

Die Prüfliste unter `tmp/german-ui-audit.json` meldet aktuell 0 wahrscheinliche offene Textkandidaten; 281 technische Werte werden bewusst ignoriert. Neue sichtbare Texte lassen den GitHub-Prüfworkflow fehlschlagen. Neue Schlüssel gehören immer in beide Dateien unter `ui/src/i18n/fork/`. Komponenten verwenden `tf` aus `ui/src/i18n/fork.ts`.

## GitHub und Updates

Lokal existiert der Branch `fork/deutsch`; `upstream` zeigt auf das Originalprojekt und `origin` auf den eigenen GitHub-Fork [DonTucci/paperclip-de](https://github.com/DonTucci/paperclip-de). Der deutsche Branch ist dort veröffentlicht.

GitHub Actions sind aktiviert; `fork/deutsch` ist der Standardbranch. Der Update-Workflow prüft täglich um 05:23 UTC das neueste stabile Paperclip-Release. Bei einem neuen Stand erstellt er einen Merge-Branch und einen Entwurfs-Pull-Request und startet den deutschen Prüfworkflow. Merge-Konflikte werden sichtbar gemeldet und nicht automatisch zugunsten einer Seite aufgelöst.

Die Übernahme eines Updates und die Umstellung einer laufenden Installation erfolgen erst nach Prüfung der Änderungen und einer Datensicherung.

## Veröffentlichungsstrategie

Der Branch `fork/deutsch` bleibt die fortlaufende Integrationslinie. Nach jedem geprüften Upstream-Update kann daraus ein eigener Release-Tag wie `de-v2026.916.0` erstellt werden. Releases werden erst nach bestandenem Prüfworkflow manuell veröffentlicht; automatische Paket- oder Cloud-Veröffentlichungen des Originalprojekts werden im Fork nicht ungeprüft übernommen.

## Geprüfter Stand

- Katalog: 6'033 Schlüssel je Sprache, identische Platzhalter, Schweizer Schreibweise bestanden.
- Übersetzungsaudit: 0 offene Kandidaten; 281 technische Werte bewusst ausgenommen.
- Katalogtests: 4 von 4 bestanden.
- TypeScript-Prüfung: bestanden.
- Produktions-Build: bestanden; nur bekannte Vite-, CSS- und Chunk-Warnungen.
- Vollständiger UI-Testbestand: 605 Testdateien und 6'345 Tests bestanden.
- Sichtprüfung in einer isolierten Testinstanz: Dashboard, Agenten, Fähigkeiten, Integrationen und Profileinstellungen geprüft.
- Design-Token-Prüfung: 109 bereits im unveränderten Original vorhandene Verstösse, davon 78 Farbwerte und 31 CSS-Klassen; keine neuen Verstösse durch die Übersetzung.
- Keine produktiven Daten verändert und keine laufende Installation umgestellt.

Das Originalprojekt und seine Lizenzhinweise bleiben erhalten: https://github.com/paperclipai/paperclip.
