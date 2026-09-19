# Deutscher Paperclip-Fork

## Ziel

Paperclip mit einer deutschen Oberfläche in Schweizer Schreibweise betreiben und stabile Änderungen des Originalprojekts regelmässig übernehmen. Interne API-Schlüssel, Datenbankwerte, Befehle und Produktnamen bleiben kompatibel.

## Technischer Aufbau

- Arbeitsbranch: `fork/deutsch`
- Original-Remote: `upstream` auf `https://github.com/paperclipai/paperclip.git`
- Eigener Fork und `origin`: noch nicht eingerichtet
- Eigener i18next-Namespace `fork` mit Englisch als Referenz und Deutsch als Standard
- 6'033 Schlüssel je Sprache
- Gespeicherte Sprachauswahl in den Profileinstellungen
- Schweizer Zahlen- und Datumsformate
- Prüfungen für Schlüssel, Platzhalter, technische Werte, Terminologie und neue sichtbare Texte

Die Trennung vom bestehenden Übersetzungskatalog des Originals verhindert, dass alle anderen Sprachen mit scheinübersetzten Einträgen aufgefüllt werden müssen. Zustands- und API-Werte bleiben intern unverändert und werden nur bei der Anzeige übersetzt.

## Aktualisierungsablauf

1. Der tägliche GitHub-Workflow ermittelt das neueste stabile Originalrelease.
2. Ein neuer Stand wird in einen eigenen Update-Branch gemergt.
3. Ein Entwurfs-Pull-Request wird erstellt und der deutsche Prüfworkflow ausdrücklich gestartet.
4. Neue Textkandidaten, Katalogabweichungen, Typfehler, Testfehler oder Buildfehler blockieren die Übernahme.
5. Neue Texte werden katalogisiert, übersetzt, terminologisch geprüft und in den betroffenen Ansichten kontrolliert.
6. Erst danach wird der Update-Pull-Request freigegeben.

Merge-Konflikte werden nicht automatisch aufgelöst. Wiederholte Läufe verwenden denselben Update-Branch und erzeugen keine doppelten Pull Requests.

## Abnahme vor GitHub

- 6'033 Katalogeinträge je Sprache geprüft
- 0 wahrscheinliche offene Textkandidaten
- 281 technische Werte bewusst geschützt
- 4 Katalogtests bestanden
- TypeScript-Prüfung bestanden
- Produktions-Build bestanden
- 605 UI-Testdateien mit 6'345 Tests bestanden
- Dashboard, Agenten, Fähigkeiten, Integrationen und Profileinstellungen in einer isolierten Instanz visuell geprüft
- 109 Design-Token-Verstösse als unveränderter Ausgangsbestand des Originals bestätigt
- Testinstanz beendet und produktive Daten unberührt gelassen

Vom Server gelieferte Ankündigungen, Benutzertexte, Agentenausgaben, Plugins und technische Protokolle können weiterhin Englisch enthalten. Diese Inhalte gehören nicht zur statischen Bedienoberfläche und werden bewusst nicht automatisch verändert.

## Verbleibender Veröffentlichungsschritt

Der lokale Stand ist bis zum GitHub-Fork abgeschlossen. Als Nächstes wird im verbundenen GitHub-Konto ein Fork erstellt, `origin` gesetzt, der Branch veröffentlicht und der erste Actions-Lauf geprüft. Die produktive Installation wird erst danach getrennt und mit vorheriger Datensicherung umgestellt.
